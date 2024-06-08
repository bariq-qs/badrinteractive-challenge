import { get } from "lodash";
import { ReactNode, useMemo } from "react";
import "@/app/styles/table.css";

type TTableDefaultProps<TData> = {
  columns: Array<{
    header: string;
    cell?: (index: number, data: TData) => ReactNode;
    field?: keyof TData;
  }>;
  data: Array<TData>;
  isLoading?: boolean;
};

const TableDefault = <T extends unknown>({
  columns,
  data,
  isLoading,
}: TTableDefaultProps<T>) => {
  const tableData = useMemo(() => data ?? [], [data]) as T[];
  return (
    <table className='table-default'>
      <thead>
        <tr>
          {columns.map((column, cIdx) => (
            <td key={cIdx}>{column.header}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, rIdx) => (
          <tr key={rIdx}>
            {columns.map((col, cIdx) => {
              if (col?.cell) {
                return <td key={cIdx}>{col?.cell(rIdx, row)}</td>;
              } else if (col.field) {
                return <td key={cIdx}>{get(row, col.field)}</td>;
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableDefault;
