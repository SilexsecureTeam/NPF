import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import { useState, useEffect } from "react";
import TeamTable from "./TeamTable";
import TeamModal from "./TeamModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import useInsurance from "@/hooks/UseInsurance";
import { toast } from "react-toastify";
import { BoardData } from "@/types";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<BoardData | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  //   const [imagePreview, setImagePreview] = useState(null);
  //   const fileRef = useRef(null);

  const { getTeam, deleteTeamById } = useInsurance();

  const fetchMembers = async () => {
    try {
      const res = await getTeam();
      setMembers(res);
    } catch {
      toast.error("Failed to load team members.");
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
    console.log("Editing member:", member);
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;
    setDeleteLoading(true); // show spinner
    try {
      await deleteTeamById(selectedMember.id as number);
      toast.success("Member deleted");
      fetchMembers();
    } catch {
      toast.error("Failed to delete member.");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteLoading(false); //hide spinner
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

        <TeamTable
          members={members}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

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
