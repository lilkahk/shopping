import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App/App";
import Layout from "./Layout/Layout";
import Collections from "./Collections/Collections";
import AboutUs from "./AboutUs/AboutUs";
import ContactUs from "./ContactUs/ContactUs";
import OurStory from "./OurStory/OurStory";
import AllProducts from "./AllProducts/AllProducts";
import { useEffect, useState } from "react";
import ProductPage from "./CollectionPage/CollectionPage";

const Router = () => {
  const [mens, setMens] = useState([])
  const [womens, setWomens] = useState([])
  const [jewelry, setJewelry] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const URL = 'https://fakestoreapi.com/products'

  useEffect(() => {
    fetch(URL, { mode: 'cors' })
      .then(res => {
        if (res.status >= 400) throw new Error('server error')
        return res.json()
      })
      .then(data => {
        const menArr = []
        const womenArr = []
        const jewelryArr = []
        const all = []
        data.forEach(element => {
          const collection = element.category
          collection === 'men\'s clothing' ? menArr.push(element) && all.push(element)
            : collection === 'women\'s clothing' ? womenArr.push(element) && all.push(element)
            : collection === 'jewelery' ? jewelryArr.push(element) && all.push(element)
            : null
        })
        menArr.push(menArr.shift())
        setMens(menArr)
        setWomens(womenArr)
        setJewelry(jewelryArr)
        setAllProducts(all)
        setCollections([
          {name: 'Mens', item: filterCollection(menArr), link: '/mens'},
          {name: 'Womens', item: filterCollection(womenArr), link:'/womens'},
          {name: 'Jewelry', item: filterCollection(jewelryArr), link: '/jewelry'}
        ])
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [URL])

  const filterCollection = collection => {
    let bestRating = 0
    let bestIdx = -1
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].rating.rate > bestRating) {
        bestIdx = i
        bestRating = collection[i].rating.rate
      }
    }
    return collection[bestIdx]
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <App />
        },
        {
          path: "collections",
          element: <Collections data={collections} />
        },
        {
          path: "mens",
          element: <ProductPage data={mens} title={'Our Mens Collection'} />
        },
        {
          path: "womens",
          element: <ProductPage data={womens} title={'Our Womens Collection'} />
        },
        {
          path: "jewelry",
          element: <ProductPage data={jewelry} title={'Our Jewelry Collection'} />
        },
        {
          path: "about-us",
          element: <AboutUs />
        },
        {
          path: "contact-us",
          element: <ContactUs />
        },
        {
          path: "our-story",
          element: <OurStory />
        },
        {
          path: "all-products",
          element: <ProductPage data={allProducts} title={'All Products'} />
        }
      ]
    }
  ])
  return <RouterProvider router={router} />
}

export default Router;