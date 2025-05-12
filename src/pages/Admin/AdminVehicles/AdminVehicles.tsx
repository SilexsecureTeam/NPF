import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import useInsurance from "@/hooks/UseInsurance";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Define interfaces for our data models
interface CarMaker {
  id: number;
  name: string;
  description: string;
}

interface CarModel {
  id: number;
  name: string;
  makerId: number;
  description: string;
  year: string;
}

interface CarType {
  id: number;
  name: string;
  modelId: number;
  description: string;
}

// Form data interfaces - simplified to only what the API needs
interface CarMakerFormData {
  name: string;
}

interface CarModelFormData {
  name: string;
  year: string;
}

interface CarNameFormData {
  name: string;
}

// Modal mode type
type ModalMode = 'add' | 'edit';
type ActiveTabType = 'carMakers' | 'carModels' | 'carNames';

// Form component props interfaces
interface CarMakerFormProps {
  initialData: CarMaker | null;
  schema: Yup.ObjectSchema<CarMakerFormData>;
  onSubmit: (data: CarMakerFormData) => Promise<void>;
}

interface CarModelFormProps {
  initialData: CarModel | null;
  schema: Yup.ObjectSchema<CarModelFormData>;
  onSubmit: (data: CarModelFormData) => Promise<void>;
}

interface CarNameFormProps {
  initialData: CarType | null;
  schema: Yup.ObjectSchema<CarNameFormData>;
  onSubmit: (data: CarNameFormData) => Promise<void>;
}

export default function AdminVehicleManagement() {
    const { CreateCarName, updateCarName, deleteCarName, createCarModel, updateCarModel, deleteCarModel, createCarMaker,
        updateCarMaker,
        deleteCarMaker,
        getCarType,
        getCarMakers,
        getCarModels,
    } = useInsurance();

    // State management with proper types
    const [carTypes, setCarTypes] = useState<CarType[]>([]);
    const [carMakers, setCarMakers] = useState<CarMaker[]>([]);
    const [carModels, setCarModels] = useState<CarModel[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTabType>('carMakers');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<ModalMode>('add');
    const [selectedItem, setSelectedItem] = useState<CarMaker | CarModel | CarType | null>(null);

    // Fetch data on component mount
    useEffect(() => {
        fetchCarTypes();
        fetchCarMakers();
        fetchCarModels();
    }, []);

    // Fetch functions
    const fetchCarTypes = async (): Promise<void> => {
        try {
            const types = await getCarType();
            setCarTypes(types);
        } catch (error) {
            console.error("Error fetching car types:", error);
        }
    };

    const fetchCarMakers = async (): Promise<void> => {
        try {
            const makers = await getCarMakers();
            setCarMakers(makers);
        } catch (error) {
            console.error("Error fetching car makers:", error);
        }
    };

    const fetchCarModels = async (): Promise<void> => {
        try {
            const models = await getCarModels();
            setCarModels(models);
        } catch (error) {
            console.error("Error fetching car models:", error);
        }
    };

    // Modal handlers
    const handleCloseModal = (): void => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleShowModal = (mode: ModalMode, item: CarMaker | CarModel | CarType | null = null): void => {
        setModalMode(mode);
        setSelectedItem(item);
        setShowModal(true);
    };

    // Validation schemas - simplified
    const carMakerSchema = Yup.object().shape({
        name: Yup.string().required("Manufacturer name is required")
    });

    const carModelSchema = Yup.object().shape({
        name: Yup.string().required("Model name is required"),
        year: Yup.string().required("Year is required")
    });

    const carNameSchema = Yup.object().shape({
        name: Yup.string().required("Car name is required")
    });

    // Car maker submit handlers
    const handleCarMakerSubmit = async (data: CarMakerFormData): Promise<void> => {
        try {
            if (modalMode === 'add') {
                // Only pass name to createCarMaker
                await createCarMaker(data.name);
            } else if (selectedItem) {
                // Only pass id and name to updateCarMaker
                await updateCarMaker((selectedItem as CarMaker).id, data.name);
            }
            fetchCarMakers();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving car maker:", error);
        }
    };

    // Car model submit handlers
    const handleCarModelSubmit = async (data: CarModelFormData): Promise<void> => {
        try {
            if (modalMode === 'add') {
                // Only pass name and year to createCarModel
                await createCarModel(data.name, data.year);
            } else if (selectedItem) {
                // Only pass id, name, and year to updateCarModel
                await updateCarModel(
                    (selectedItem as CarModel).id, 
                    data.name, 
                    data.year
                );
            }
            fetchCarModels();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving car model:", error);
        }
    };

    // Car name submit handlers
    const handleCarNameSubmit = async (data: CarNameFormData): Promise<void> => {
        try {
            if (modalMode === 'add') {
                // Only pass name to CreateCarName
                await CreateCarName(data.name);
            } else if (selectedItem) {
                // Only pass id and name to updateCarName
                await updateCarName(
                    (selectedItem as CarType).id, 
                    data.name
                );
            }
            fetchCarTypes();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving car type:", error);
        }
    };

    return (
        <AdminDashboardLayout>
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-6">Vehicle Management</h2>
                
                {/* Custom Tabs - Changed to green */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            className={`${
                                activeTab === 'carMakers' 
                                ? 'border-green-500 text-green-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                            onClick={() => setActiveTab('carMakers')}
                        >
                            Car Manufacturers
                        </button>
                        <button
                            className={`${
                                activeTab === 'carModels' 
                                ? 'border-green-500 text-green-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                            onClick={() => setActiveTab('carModels')}
                        >
                            Car Models
                        </button>
                        <button
                            className={`${
                                activeTab === 'carNames' 
                                ? 'border-green-500 text-green-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                            onClick={() => setActiveTab('carNames')}
                        >
                            Car Names/Types
                        </button>
                    </nav>
                </div>

                {/* Car Manufacturers Tab Content */}
                {activeTab === 'carMakers' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button 
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => handleShowModal('add')}
                            >
                                Add Manufacturer
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {carMakers.map((maker, index) => (
                                        <tr key={maker.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{maker.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{maker.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button 
                                                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2 text-xs"
                                                    onClick={() => handleShowModal('edit', maker)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
                                                    onClick={async () => {
                                                        if (window.confirm("Are you sure you want to delete this manufacturer?")) {
                                                            await deleteCarMaker(maker.id);
                                                            fetchCarMakers();
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Car Models Tab Content */}
                {activeTab === 'carModels' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button 
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => handleShowModal('add')}
                            >
                                Add Model
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {carModels.map((model, index) => (
                                        <tr key={model.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{model.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.year}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {carMakers.find(m => m.id === model.makerId)?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button 
                                                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2 text-xs"
                                                    onClick={() => handleShowModal('edit', model)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
                                                    onClick={async () => {
                                                        if (window.confirm("Are you sure you want to delete this model?")) {
                                                            await deleteCarModel(model.id);
                                                            fetchCarModels();
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Car Names/Types Tab Content */}
                {activeTab === 'carNames' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button 
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => handleShowModal('add')}
                            >
                                Add Car Type
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {carTypes.map((car, index) => (
                                        <tr key={car.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{car.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {carModels.find(m => m.id === car.modelId)?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{car.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button 
                                                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2 text-xs"
                                                    onClick={() => handleShowModal('edit', car)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
                                                    onClick={async () => {
                                                        if (window.confirm("Are you sure you want to delete this car type?")) {
                                                            await deleteCarName(car.id);
                                                            fetchCarTypes();
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Custom Modal */}
                {showModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseModal}></div>
                            </div>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                {modalMode === 'add' ? 'Add' : 'Edit'} {activeTab === 'carMakers' ? 'Manufacturer' : activeTab === 'carModels' ? 'Model' : 'Car Type'}
                                            </h3>
                                            
                                            {/* Form for Car Makers - Simplified */}
                                            {activeTab === 'carMakers' && (
                                                <CarMakerForm 
                                                    initialData={modalMode === 'edit' ? selectedItem as CarMaker : null}
                                                    schema={carMakerSchema}
                                                    onSubmit={handleCarMakerSubmit}
                                                />
                                            )}
                                            
                                            {/* Form for Car Models - Simplified */}
                                            {activeTab === 'carModels' && (
                                                <CarModelForm 
                                                    initialData={modalMode === 'edit' ? selectedItem as CarModel : null}
                                                    schema={carModelSchema}
                                                    onSubmit={handleCarModelSubmit}
                                                />
                                            )}
                                            
                                            {/* Form for Car Names/Types - Simplified */}
                                            {activeTab === 'carNames' && (
                                                <CarNameForm 
                                                    initialData={modalMode === 'edit' ? selectedItem as CarType : null}
                                                    schema={carNameSchema}
                                                    onSubmit={handleCarNameSubmit}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button 
                                        type="button" 
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminDashboardLayout>
    );
}

// Form Components using React Hook Form - simplified to only necessary fields
function CarMakerForm({ initialData, schema, onSubmit }: CarMakerFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CarMakerFormData>({
        resolver: yupResolver(schema),
        defaultValues: initialData ? {
            name: initialData.name
        } : {
            name: ''
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Manufacturer Name
                </label>
                <input
                    {...register('name')}
                    className={`shadow appearance-none border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="name"
                    type="text"
                    placeholder="Manufacturer name"
                />
                {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
            </div>
            
            <div className="flex items-center justify-between">
                <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}

function CarModelForm({ initialData, schema, onSubmit }: CarModelFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CarModelFormData>({
        resolver: yupResolver(schema),
        defaultValues: initialData ? {
            name: initialData.name,
            year: initialData.year
        } : {
            name: '',
            year: ''
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Model Name
                </label>
                <input
                    {...register('name')}
                    className={`shadow appearance-none border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="name"
                    type="text"
                    placeholder="Model name"
                />
                {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                    Year
                </label>
                <input
                    {...register('year')}
                    className={`shadow appearance-none border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="year"
                    type="text"
                    placeholder="Model year (e.g. 2023)"
                />
                {errors.year && <p className="text-red-500 text-xs italic">{errors.year.message}</p>}
            </div>
            
            <div className="flex items-center justify-between">
                <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}

function CarNameForm({ initialData, schema, onSubmit }: CarNameFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CarNameFormData>({
        resolver: yupResolver(schema),
        defaultValues: initialData ? {
            name: initialData.name
        } : {
            name: ''
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Car Name/Type
                </label>
                <input
                    {...register('name')}
                    className={`shadow appearance-none border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="name"
                    type="text"
                    placeholder="Car name/type"
                />
                {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
            </div>
            
            <div className="flex items-center justify-between">
                <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}