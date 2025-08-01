import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { useState, useEffect } from "react";
import TeamTable from "./TeamTable";
import TeamModal from "./TeamModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import useInsurance from "@/hooks/UseInsurance";
import { toast } from "react-toastify";
import { BoardData } from "@/types";
import { FaSpinner } from "react-icons/fa";

export default function Team() {
  const [members, setMembers] = useState<BoardData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<BoardData | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 new loading state

  const { getTeam, deleteTeamById } = useInsurance();

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await getTeam();
      setMembers(res);
    } catch {
      toast.error("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAdd = () => {
    setSelectedMember(null);
    setEditing(false);
    setModalOpen(true);
  };

  const handleEdit = (member: BoardData) => {
    setSelectedMember(member);
    setEditing(true);
    setModalOpen(true);
  };

  const handleDelete = (member: BoardData) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;
    setDeleteLoading(true);
    try {
      await deleteTeamById(selectedMember.id as number);
      toast.success("Member deleted");
      fetchMembers();
    } catch {
      toast.error("Failed to delete member.");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="py-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Team Members</h1>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Add Member
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-green-600 text-4xl" />
          </div>
        ) : (
          <TeamTable
            members={members}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {modalOpen && (
          <TeamModal
            isOpen={modalOpen}
            closeModal={() => setModalOpen(false)}
            editing={editing}
            member={selectedMember}
            fetchMembers={fetchMembers}
          />
        )}

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />
      </div>
    </AdminDashboardLayout>
  );
}
