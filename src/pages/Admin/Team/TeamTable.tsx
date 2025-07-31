import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function TeamTable({ members, onEdit, onDelete }: any) {
  const truncate = (text: string, max = 50) =>
    text.length <= max ? text : text.slice(0, max) + "...";

  if (!members.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No team members found. Add your first team member!
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg w-full overflow-x-auto">
      <table className="min-w-[700px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Image", "Name", "Title", "Description", "Actions"].map((col) => (
              <th
                key={col}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map((m: any) => (
            <tr key={m.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {m.image ? (
                  <img
                    src={`https://dash.npfinsurance.com/uploads/${m.image}`}
                    alt={m.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    N/A
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{m.name}</td>
              <td className="px-6 py-4">{m.title}</td>
              <td className="px-6 py-4">{truncate(m.description || "")}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex space-x-2 items-center justify-end">
                  <button
                    onClick={() => onEdit(m)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(m)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
