import React, { useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";

function TheAddModal({ closeModal }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    viewCount: "",
    status: "",
    discount: "",
    image: null,
    imageUrl: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    category: "",
    price: "",
    viewCount: "",
    status: "",
    discount: "",
  });

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
      imageUrl: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: value ? "" : `Field "${name}" is empty`,
    });
  };
  const [formError, setFormError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "category",
      "price",
      "viewCount",
      "status",
      "discount",
    ];

    const hasEmptyField = requiredFields.some((field) => !formData[field]);

    if (hasEmptyField || !formData.image) {
      setFormError("Please fill in all required fields and select an image.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", "Product description");
      formDataToSend.append("category", formData.category);
      formDataToSend.append("price", parseFloat(formData.price));
      formDataToSend.append("isFeatured", true);
      formDataToSend.append("tags", "tag1, tag2, tag3");
      formDataToSend.append("sellerId", 1);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("viewCount", parseInt(formData.viewCount));
      formDataToSend.append("slug", "hhhhhhhh");
      formDataToSend.append("discount", formData.discount);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/v1/product/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Data posted:", response.data);
      closeModal();
      setFormError("");
      setFormData({
        name: "",
        category: "",
        price: "",
        viewCount: "",
        status: "",
        discount: "",
        image: null,
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  return (
    <div className="fixed inset-0  z-50 w-[100%] flex items-center justify-end">
      <div className="bg-white rounded-lg p-8 pt-4 w-[80%] h-[80vh] mr-9 mt-14 shadow-custom-shadow">
        <div className="flex justify-end">
          <button onClick={closeModal} title="Close">
            <IoClose className="text-2xl " />
          </button>
        </div>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-1 border">
            <div className="w-[50%] border-r p-3">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-sm">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="category" className="mb-1 text-sm">
                  Product Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2  focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="viewCount" className="mb-1 text-sm">
                  Quantity
                </label>
                <input
                  type="number"
                  id="viewCount"
                  name="viewCount"
                  value={formData.viewCount}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2  focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="price" className="mb-1 text-sm">
                  Amount
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="any"
                  className="border border-gray-300 rounded-md p-2  focus:outline-none mb-1"
                />
              </div>

              <div className="flex items-center gap-3 mt-2 mb-2">
                <div>
                  <label htmlFor="status" className="mb-1 text-sm">
                    Status:
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, status: "Active" })
                    }
                    className={`text-sm border rounded-md px-2 py-1  focus:outline-none ${
                      formData.status === "Active"
                        ? "bg-green-600 text-white"
                        : ""
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, status: "Inactive" })
                    }
                    className={`text-sm border rounded-md px-2 py-1  focus:outline-none ${
                      formData.status === "Inactive"
                        ? "bg-yellow-600 text-white"
                        : ""
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="discount" className="mb-1 text-sm">
                  Discount
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  step="any"
                  className="border border-gray-300 rounded-md p-2  focus:outline-none"
                />
              </div>
            </div>
            {formError && (
              <p className="text-red-600 text-xs mb-4 w-[10rem]">{formError}</p>
            )}
            <div className="w-[50%] border-l">
              <div className="flex items-center gap-4 justify-center pt-2">
                <label htmlFor="image" className="mb-1 text-sm">
                  Select Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="border border-gray-200 rounded-md p-2 text-xs cursor-pointer"
                />
              </div>
              {formData.imageUrl && (
                <div className="h-full flex justify-center mt-5">
                  <img
                    src={formData.imageUrl}
                    alt="Selected Image"
                    className="max-w-[300px] max-h-[300px]"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-admin-blue hover:bg-blue-800 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TheAddModal;