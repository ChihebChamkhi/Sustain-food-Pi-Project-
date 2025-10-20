const DescriptionSection = () => {

  
    return (
        <>
          <section className="py-12 bg-gray-100 justify-center">
            <div className="container mx-auto text-center px-4">
              <h2 className="text-3xl text-gray-700 mx-auto max-w-4xl mb-6">
                SoustainFood is an initiative that brings together individuals, local businesses, cafes, and restaurants to fight against food waste while promoting sustainable practices.
              </h2>
              
              <p className="text-lg text-gray-600 mx-auto max-w-4xl mb-4">
              Through our platform, users can purchase unsold food at reduced prices from our partners. By doing this, not only are they helping to feed those in need, but they are also helping to preserve the planet by reducing food waste.
              </p>
            </div>
          </section>
      
          <section>
            {/* Bande animée des produits disponibles */}
            <div className="relative">
              <div className="overflow-hidden bg-orangeFance py-4">
                <div className="flex animate-marquee">
                  <div className="px-4 text-2xl font-bold text-white">SUPERMARKETS</div>
                  <div className="px-4 text-2xl font-bold text-white">PASTRY</div>
                  <div className="px-4 text-2xl font-bold text-white">BREAD</div>
                  <div className="px-4 text-2xl font-bold text-white">HOTELS</div>
                  <div className="px-4 text-2xl font-bold text-white">SUPERMARKETS</div>
                  <div className="px-4 text-2xl font-bold text-white">PASTRY</div>
                  <div className="px-4 text-2xl font-bold text-white">BREAD</div>
                  <div className="px-4 text-2xl font-bold text-white">HOTELS</div>
                  <div className="px-4 text-2xl font-bold text-white">SUPERMARKETS</div>
                  <div className="px-4 text-2xl font-bold text-white">PASTRY</div>
                  <div className="px-4 text-2xl font-bold text-white">BREAD</div>
                  <div className="px-4 text-2xl font-bold text-white">HOTELS</div>
                  <div className="px-4 text-2xl font-bold text-white">SUPERMARKETS</div>
                  <div className="px-4 text-2xl font-bold text-white">PASTRY</div>
                  <div className="px-4 text-2xl font-bold text-white">BREAD</div>
                  <div className="px-4 text-2xl font-bold text-white">HOTELS</div>
                </div>
              </div>
            </div>
          </section>
        </>
      );
      
};

export default DescriptionSection;
