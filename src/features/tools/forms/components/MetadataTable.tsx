"use client";

import { infoLabel, type MetadataReport } from "../ops/metadata";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <tr className="align-top">
      <th scope="row" className="py-1.5 pr-3 text-left font-medium text-slate-500 whitespace-nowrap">
        {k}
      </th>
      <td className="py-1.5 text-slate-800 break-all">{v || <span className="text-slate-400">(empty)</span>}</td>
    </tr>
  );
}

/** Everything a metadata report found, or a clear "nothing" line. */
export function MetadataTable({ report, includePages }: { report: MetadataReport; includePages: boolean }) {
  const pageBits = [
    report.pagesWithMetadata ? `${report.pagesWithMetadata} page(s) with their own XMP metadata` : null,
    report.pagesWithPieceInfo ? `${report.pagesWithPieceInfo} page(s) with private app data (PieceInfo)` : null,
    report.catalogPieceInfo ? "Document-level private app data (PieceInfo)" : null,
  ].filter(Boolean) as string[];
  const empty = report.info.length === 0 && report.xmpBytes === null && (!includePages || pageBits.length === 0);
  if (empty) return <p className="text-xs text-slate-600">No metadata.</p>;
  return (
    <div className="space-y-3 text-xs">
      {report.info.length > 0 && (
        <div>
          <p className="font-semibold text-slate-700 mb-1">Document properties (Info dictionary)</p>
          <table className="w-full">
            <tbody className="divide-y divide-slate-100">
              {report.info.map((e) => (
                <Row key={e.key} k={infoLabel(e.key)} v={e.value} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {report.xmpBytes !== null && (
        <div>
          <p className="font-semibold text-slate-700 mb-1">
            XMP metadata stream ({report.xmpBytes.toLocaleString()} bytes)
          </p>
          {report.xmpFields.length > 0 ? (
            <table className="w-full">
              <tbody className="divide-y divide-slate-100">
                {report.xmpFields.map((e) => (
                  <Row key={e.key} k={e.key} v={e.value} />
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-slate-500">No common properties recognised (it may hold editing history or IDs).</p>
          )}
        </div>
      )}
      {pageBits.length > 0 && (
        <ul className="list-disc pl-4 text-slate-700">
          {pageBits.map((b) => (
            <li key={b}>
              {b}
              {!includePages && " — kept"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
