"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import Papa from "papaparse";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { EligibilityTool } from "./EligibilityTool";

const requiredColumnsMap: Record<string, string[]> = {
  calpads: ["SSID", "FirstName", "LastName", "DOB"],
  calsaws: ["CaseNumber", "FirstName", "LastName", "DOB"],
  eligibility: ["ParticipantID", "IssuanceType", "IssuanceAmount", "IssuanceDate"],
};

export function DataImportPage() {
  const [selectedSource, setSelectedSource] = useState("calpads");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [rawRecords, setRawRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [importJobs, setImportJobs] = useState<{ jobId: string; status: string }[]>([]);
  const rowsPerPage = 10;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      Papa.parse<File>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result: Papa.ParseResult<any>) => {
          const headers = result.meta.fields ?? [];
          const required = requiredColumnsMap[selectedSource];
          const missing = required.filter(col => !headers.includes(col));
          if (missing.length > 0) {
            setFileError(`Missing required columns: ${missing.join(", ")}`);
            setJobStatus("");
            setCsvFile(null);
            setParsedData([]);
          } else {
            setParsedData(result.data);
            setCsvFile(file);
            setFileError(null);
          }
        },
        error: (error: Error, _file: File) => {
    setFileError(error.message);
  }
      });
    }
  };

  const handleExtractData = async () => {
    if (!parsedData.length) return;
    try {
      setJobStatus("Importing...");
      const res = await axios.post('/api/import-data', {
        data: parsedData,
        source: selectedSource, // 'CALPADS' or 'CALSAWS'
        });
      const jobId = res.data.jobId;

      // Add job to importJobs state
      setImportJobs((jobs) => [...jobs, { jobId, status: "processing" }]);
      setActiveTab("import-progress"); // switch to import progress tab
    } catch (err) {
      console.error("Import error:", err);
      setJobStatus("Error during import");
    }
  };

  const fetchRawRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/results");
      const ordered = res.data.map((row: { SSID: string; FirstName: string; LastName: string; DOB: any; Address: string; MealStatus: string; CaseNumber: string; CALSAWS_ProgramType: string; IsEligible: boolean; Reason: string}) => ({
        SSID: row.SSID,
        First_Name: row.FirstName,
        Last_Name: row.LastName,
        DOB: row.DOB,
        Address: row.Address,
        Meal_Status: row.MealStatus,
        Case_Number: row.CaseNumber,
        CALSAWS_ProgramType: row.CALSAWS_ProgramType,
        Is_Eligible: row.IsEligible,
        Reason: row.Reason
      }));
      setRawRecords(ordered);
    } catch (err) {
      console.error("Failed to load raw records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "results") {
      fetchRawRecords();
    }
  }, [activeTab]);

    useEffect(() => {
  if (activeTab === "import-progress" && importJobs.length > 0) {
    const interval = setInterval(async () => {
      const updatedJobs = await Promise.all(
        importJobs.map(async (job) => {
          try {
             if (job.status === "done" || job.status === "failed") {
              return job;
            }
          else {
            const res = await axios.get(`/api/import/${job.jobId}`);
            setJobStatus("Successfully Imported");
            return { jobId: job.jobId, status: res.data.status };
          }
          } catch {
            // Preserve 'complete' status; otherwise, mark as 'failed'
            if (job.status === "done") {
              return job;
            }
            setJobStatus("Error during import")
            return { jobId: job.jobId, status: "failed" };
          }
        })
      );
      setImportJobs(updatedJobs);

      if (!updatedJobs.some((j) => j.status === "processing")) {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }
}, [activeTab, importJobs]);

  const filteredSortedRecords = rawRecords
    .filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(filterQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      const aVal = String(a[sortKey]).toLowerCase();
      const bVal = String(b[sortKey]).toLowerCase();
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

  const paginatedRecords = filteredSortedRecords.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredSortedRecords.length / rowsPerPage);

   return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Data Import</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="import-progress">Import Progress</TabsTrigger> 
          <TabsTrigger value="results">Import Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Select Source:</label>
            <select
              className="border px-2 py-1 rounded"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="calpads">CALPADS</option>
              <option value="calsaws">CALSAWS</option>
              <option value="eligibility">EDC</option>
            </select>
          </div>

          <Input type="file" className="cursor-pointer" accept=".csv" onChange={handleFileChange} />

          {fileError && <p className="text-red-500 mt-2">{fileError}</p>}

          {csvFile && (
            <div className="mt-4">
              <p>✅ File: {csvFile.name} is ready for extraction.</p>
              <Button className="mt-2" onClick={handleExtractData}>
                Extract Data
              </Button>
            </div>
          )}

          {jobStatus && <p className="mt-2 text-blue-600">{jobStatus}</p>}
        </TabsContent>

        <TabsContent value="results">
          <h2 className="text-lg font-semibold mb-2">Imported Records (RawCALPADS & RawCALSAWS)</h2>

          <Input
            type="text"
            placeholder="Filter results..."
            className="mb-3"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />

          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin" />
              <span>Loading...</span>
            </div>
          ) : rawRecords.length === 0 ? (
            <p>No records found.</p>
          ) : (
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(rawRecords[0]).map((key) => (
                      <th
                        key={key}
                        className="text-left px-2 py-1 border-b cursor-pointer"
                        onClick={() => {
                          if (sortKey === key) {
                            setSortAsc(!sortAsc);
                          } else {
                            setSortKey(key);
                            setSortAsc(true);
                          }
                        }}
                      >
                        {key} {sortKey === key ? (sortAsc ? "▲" : "▼") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map((row, i) => (
                    <tr key={i} className="border-b">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-2 py-1">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-2 p-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="import-progress">
          <h2 className="text-lg font-semibold mb-2">Import Job Progress</h2>
          {importJobs.length === 0 ? (
            <p>No import jobs in progress.</p>
          ) : (
            <table className="min-w-50 border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1 border">Job ID</th>
                  <th className="px-2 py-1 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {importJobs.map(({ jobId, status }) => (
                  <tr key={jobId} className="border-b">
                    <td className="px-2 py-1 break-all">{jobId}</td>
                    <td className="px-2 py-1">
                      {status === "processing" && (
                        <span className="text-blue-600 font-semibold">Processing...</span>
                      )}
                      {status === "done" && (
                        <span className="text-green-600 font-semibold">Completed</span>
                      )}
                      {status === "failed" && (
                        <span className="text-red-600 font-semibold">Failed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
