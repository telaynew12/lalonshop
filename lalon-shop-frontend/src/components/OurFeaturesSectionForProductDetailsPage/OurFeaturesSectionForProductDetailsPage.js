import { RiSecurePaymentFill } from "react-icons/ri";
import { FaHandHoldingHand } from "react-icons/fa6";
import { PiLeafDuotone } from "react-icons/pi";

const OurFeaturesSectionForProductDetailsPage = () => {
  return (
    <div className="bg-gray-200 mt-10">
      <div className="container py-10 md:py-20 flex flex-col md:flex-row gap-y-8 items-center  md:justify-around text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <RiSecurePaymentFill className="text-main text-6xl" />
          <div>
            <h3 className="text-xl font-semibold">Secure Payment</h3>
            <p>Select from multiple secure methods</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <FaHandHoldingHand className="text-main text-6xl" />
          <div>
            <h3 className="text-xl font-semibold">Green Delivery</h3>
            <p>Delivery within 3 to 5 days</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <PiLeafDuotone className="text-main text-6xl" />
          <div>
            <h3 className="text-xl font-semibold">100% Natural</h3>
            <p>Committed to natural items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurFeaturesSectionForProductDetailsPage;
