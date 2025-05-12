import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import useInsurance from '@/hooks/UseInsurance';
import { Layout } from '../Layout/layout';

// Define the service page interface based on your API response
interface ServicePageData {
  id: number;
  title: string;
  description: string;
  features: string;
  image: string;
  created_at: string;
  updated_at: string;
}

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Enhanced helper function to clean HTML content
function cleanHtml(html: string): string {
  if (!html) return '';
  // First decode entities
  const decoded = decodeHtmlEntities(html);
  // Then remove all HTML tags
  return decoded.replace(/<\/?[^>]+(>|$)/g, '').trim();
}

const ServiceDetailPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<ServicePageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const previousServiceId = useRef<string | null>(null);
  
  const { getServicePageById } = useInsurance();

  // Scroll to top only on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fetch service data only when serviceId changes
  useEffect(() => {
    // Prevent duplicate calls for the same serviceId
    if (previousServiceId.current === serviceId) {
      return;
    }
    
    previousServiceId.current = serviceId ?? null;
    setLoading(true);
    
    const fetchServiceDetails = async () => {
      if (!serviceId) {
        setError('Service ID not found');
        setLoading(false);
        return;
      }
      
      try {
        const data = await getServicePageById(parseInt(serviceId));
        
        if (data) {
          setService(data);
        } else {
          setError('Service not found');
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [serviceId, getServicePageById]);

  // Extract clean title (remove HTML tags and decode entities)
  const getCleanTitle = (htmlTitle: string): string => {
    return cleanHtml(htmlTitle).toUpperCase();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !service) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h2 className="text-xl text-red-700 mb-2">Error Loading Service</h2>
            <p className="text-red-600">{error || 'Service not found'}</p>
            <button 
              onClick={() => window.history.back()} 
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const cleanTitle = getCleanTitle(service.title);
  
  // Pre-process content to ensure proper HTML entity handling
  const processedDescription = service.description || '';
  const processedFeatures = service.features || '';
  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="w-full relative">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(270deg, rgba(255, 255, 255, 0.04) 0%, rgba(31, 131, 64, 0.4) 34.5%, rgba(31, 131, 64, 0.4) 89.38%)'
        }}></div>
        <img
          src={`https://dash.npfinsurance.com/uploads/${service.image}` }
          alt={cleanTitle}
          className="w-full min-h-[400px] max-h-[420px] object-cover object-top"
          loading="eager" // Prioritize image loading
        />
        <div className="absolute bottom-[15%] right-[20%] text-left sm:text-left bg-[#FFFFFFE5] bg-opacity-15 p-5 md:px-8">
          <div className="text-3xl sm:text-5xl font-bold">
            <h1 className='text-2xl md:text-3xl lg:text-5xl xl:text-5xl'>Your <span className="text-green-800">Safety Net</span> for</h1>
            <h1 className='text-2xl md:text-3xl lg:text-5xl xl:text-5xl'>Life's Uncertainties</h1>
          </div>
          <div className="my-1 text-lg sm:text-xl py-3">
            <p className="text-[#00000080]">
              Protecting you and your loved ones with reliable <br />
              coverage when you need it most.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-[#1F834008] px-8 lg:px-32 py-10">
        {/* Description Column */}
        <div className='pb-10'>
          <div className="mb-3 text-sm text-[#1F8340] font-semibold flex gap-2 items-center w-fit">
            <div className="w-2 h-2 rounded-full bg-[#1F8340]"></div>
            <span>Explore our</span>
          </div>
          <h4 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-5">
            {cleanTitle}
          </h4>
          <div 
            className="font-medium text-[#000000] text-sm leading-7 md:text-base md:leading-8 text-justify"
            dangerouslySetInnerHTML={{ __html: processedDescription }}
          ></div>
          <Link to={'/make-a-claim'}>
            <button className="mt-7 md:mt-14 relative px-4 py-1.5 text-white text-sm font-bold rounded-full bg-red-600 border-[5px] border-white ">
              Make a claim
              <span className="absolute inset-0 rounded-full border-2 border-[#000000] -m-1.5"></span>
              <span className="absolute -left-1.5 top-0 h-full w-1 bg-[#1F834008] rounded-full"></span>
              <span className="absolute -right-1.5 top-0 h-full w-1 bg-[#1F834008] rounded-full"></span>
            </button>
          </Link>
        </div>

        {/* Features Column - White background */}
        {processedFeatures && (
          <div className=" rounded-xl md:rounded-2xl p-5 lg:p-10 w-full h-fit ">
            <h4 className="font-semibold mb-6 text-[#000000]">
              {/* Extract the first h4 from features, or use default */}
              {processedFeatures.includes('<h4>') 
                ? cleanHtml(processedFeatures.split('<h4>')[1].split('</h4>')[0])
                : "Features"}
            </h4>
            <div className="font-medium text-[#787474] text-sm md:text-base">
              <ul className="list-none space-y-2 mb-8">
                {decodeHtmlEntities(processedFeatures)
                  .replace(/<h4>.*?<\/h4>/s, '') // Remove h4 title if present
                  .split(/(?:<br\s*\/?>|\n)/) // Split by <br> tags or newlines
                  .map(line => cleanHtml(line)) // Clean all HTML
                  .filter(line => line.trim() !== '')
                  .map((line, index) => (
                    <li key={index} className="flex gap-1.5 items-center">
                      <img src="/assets/images/check.svg" alt="" className="w-4 h-4" />
                      <span>{line}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default ServiceDetailPage;