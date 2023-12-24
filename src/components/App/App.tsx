import { useQueryClient } from "react-query";
import { Routes, Route } from "react-router-dom";
import MainLayout from "~/components/MainLayout/MainLayout";
import PageProductForm from "~/components/pages/PageProductForm/PageProductForm";
import PageOrders from "~/components/pages/PageOrders/PageOrders";
import PageOrder from "~/components/pages/PageOrder/PageOrder";
import PageProductImport from "~/components/pages/admin/PageProductImport/PageProductImport";
import PageCart from "~/components/pages/PageCart/PageCart";
import PageProducts from "~/components/pages/PageProducts/PageProducts";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("get-products-token")) {
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const codeValue = urlParams.get("code");
      if (!codeValue) {
        return;
      }

      try {
        const token = await axios.post(
          "https://slnchnrssdevpool.auth.eu-west-1.amazoncognito.com/oauth2/token",
          {},
          {
            params: {
              grant_type: "authorization_code",
              client_id: "1hrrj9p0s56el2mcd7ca3us3i1",
              code: codeValue,
              redirect_uri: "https://d1vdv7tmd1pu8.cloudfront.net/",
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (token?.data?.id_token) {
          localStorage.setItem("get-products-token", token.data.id_token);
        }

        // invalidate the
        queryClient.invalidateQueries("available-products");
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, [queryClient]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<PageProducts />} />
        <Route path="cart" element={<PageCart />} />
        <Route path="admin/orders">
          <Route index element={<PageOrders />} />
          <Route path=":id" element={<PageOrder />} />
        </Route>
        <Route path="admin/products" element={<PageProductImport />} />
        <Route path="admin/product-form">
          <Route index element={<PageProductForm />} />
          <Route path=":id" element={<PageProductForm />} />
        </Route>
        <Route
          path="*"
          element={<Typography variant="h1">Not found</Typography>}
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
