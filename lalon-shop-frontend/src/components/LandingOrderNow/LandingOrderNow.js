const LandingOrderNow = ({ setSeeAttributeModal }) => {
  return (
    <button
      onClick={() => setSeeAttributeModal(true)}
      className="bg-green-600 mt-3 font-semibold text-white py-2 px-5 rounded-full"
    >
      অর্ডার করুন
    </button>
  );
};

export default LandingOrderNow;
