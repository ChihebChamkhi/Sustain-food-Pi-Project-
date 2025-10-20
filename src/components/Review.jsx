import ReviewCard from "../layouts/ReviewCard";
import img1 from "../assets/img/pic1.png";
import img2 from "../assets/img/pic2.png";
import img3 from "../assets/img/pic3.png";

const Review = () => {
useEffect(() => {
    document.title = "Review";
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center px-5 py-24 md:px-32">
      <h1 className="pt-24 pb-10 text-4xl font-semibold text-center lg:pt-16">
        Customer's Review
      </h1>
      <div className="flex flex-col gap-5 mt-5 md:flex-row">
        <ReviewCard img={img1} name="Sophia Azura" />
        <ReviewCard img={img2} name="John Deo" />
        <ReviewCard img={img3} name="Victoria Zoe" />
      </div>
    </div>
  );
};

export default Review;
