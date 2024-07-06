import Link from "next/link";
import React from "react";

const Card = ({ blog }) => {
  // Convert Firestore timestamp to JavaScript Date object
  const createdAtDate = blog.createdAt?.toDate() || new Date();

  // Format the date as desired
  const formattedDate = createdAtDate.toLocaleDateString();

  return (
    <div>
      <div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
        <div className="relative h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
          <img
            src={blog.image}
            alt="card-image"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-6">
          <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            {blog.name}
          </h5>
          <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            {blog.category}
          </p>
          <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            {formattedDate}
          </p>
          {blog.author && (
            <div className="flex items-center space-x-2 mt-4">
              {blog.authorImage && (
                <img
                  src={blog.authorImage}
                  alt="author-image"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
                Author: {blog.author}
              </p>
            </div>
          )}
        </div>
        <div className="p-6 pt-0">
          <Link href={`blogs/${blog.id}`}>
            <button
              className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
              type="button"
            >
              Read More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
