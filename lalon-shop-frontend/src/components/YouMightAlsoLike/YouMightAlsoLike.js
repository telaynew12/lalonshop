import { useRelatedProductQuery } from "@/redux/api/query";
import ProductCardSkleton from "../ProductCardSkleton/ProductCardSkleton";
import ProductCard from "../ProductCard/ProductCard";

const YouMightAlsoLike = ({ productId }) => {
  const {
    data: relatedProduct,
    isLoading,
    isFetching,
  } = useRelatedProductQuery(productId);

  return (
    <div className="container p-5 md:py-10">
      <p className="text-2xl md:text-4xl  text-center my-10 md:mt-14">
        You Might Also Like
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
        {(isLoading || isFetching) &&
          new Array(10)
            .fill(0)
            .map((item, i) => <ProductCardSkleton key={i} />)}

        {(!isLoading || !isFetching) &&
          relatedProduct?.products?.map((item, i) => (
            <div key={i} className="border p-3 rounded-md bg-white">
              <ProductCard details={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default YouMightAlsoLike;
