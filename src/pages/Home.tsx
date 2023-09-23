/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { ListDetail } from "../components/ListDetail";
import { DetailCard } from "../components/DetailCard";
import { LocationDetail } from "../models/types";
import { SearchIcon } from "./../icons";
import { useWindowSize } from "../hooks/useWindownSize";
import { useAuthContext } from "../context/AuthContext";

function Home() {
  const {
    getListLocation,
    listLocation,
    getListLocationNearBy,
    listLocationNearBy,
    coordsNow,
  } = useAuthContext();
  const [valueFilter, setValueFilter] = useState("");

  const { width } = useWindowSize();

  const dataReadyToMint = listLocation.find((item) => {
    if (item.distance) {
      return item.distance <= 500;
    }
  });

  useEffect(() => {
    getListLocation(valueFilter);
  }, [coordsNow, valueFilter]);

  useEffect(() => {
    getListLocationNearBy();
  }, [coordsNow]);

  return (
    <div className="w-full px-[20px] sm:px-0">
      <div>
        <div
          className="mb-[60px] w-full sm:h-[264px] bg-cover flex items-center justify-center "
          style={{
            backgroundImage:
              width >= 640
                ? `url('https://vapa.vn/wp-content/uploads/2022/12/anh-canh-dep-001-1.jpg')`
                : "",
          }}
        >
          <div className="max-w-[870px] sm:w-[870px] sm:ml-auto sm:mr-auto ">
            <div className="sm:w-[335px]">
              <p className="text-[34px] font-bold text-black sm:text-white">
                Enjoy your trip in Hanoi!
              </p>
              <Input
                size="large"
                placeholder="Search any location..."
                suffix={<SearchIcon />}
                className="h-14 rounded-3xl w-full rounded-[99px] "
                onChange={(e) => setValueFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[870px] ml-auto mr-auto">
        {valueFilter ? (
          <ListDetail data={listLocation} />
        ) : (
          <>
            {dataReadyToMint && (
              <div className="mb-10">
                <DetailCard data={dataReadyToMint as LocationDetail} />
              </div>
            )}
            <div className="mb-10">
              <div className="text-base font-semibold">Nearby</div>
              <ListDetail data={listLocationNearBy} />
            </div>

            <div className="mb-10">
              <div className="text-base font-semibold">
                Popular minted locations
              </div>
              <ListDetail data={listLocation} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
