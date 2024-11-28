import { useEffect, useMemo, useState } from "react";
import { useGetExperimentsQuery } from "../services/autosubmitApiV4";
import { useSearchParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import ExperimentCard from "../common/ExperimentCard";
import Paginator from "../common/Paginator";
import { useWindowSize } from "@uidotdev/usehooks";
import { Switch } from "@headlessui/react";
import IntervalButton from "../common/IntervalButton";
import { useForm } from "react-hook-form";
import { cn } from "../services/utils";

const searchParamsToKeyValue = (searchParams) => {
  let searchParamsObj = {};
  [...searchParams.keys()].forEach((key) => {
    searchParamsObj[key] = searchParams.get(key);
  });
  return searchParamsObj;
};

const EXP_ORDER_BY = [
  {
    key: "created_desc",
    name: "Creation date (descending)",
    order_by: "created",
    order_desc: true,
  },
  {
    key: "created_asc",
    name: "Creation date (ascending)",
    order_by: "created",
    order_desc: false,
  },
  {
    key: "expid_asc",
    name: "EXPID (alphabetically)",
    order_by: "expid",
    order_desc: false,
  },
];

const Home = () => {
  useASTitle("Home");
  useBreadcrumb([{ name: "Experiments" }]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { width } = useWindowSize();

  const { register, handleSubmit, setValue } = useForm();
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const toggleMoreFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  const isOnlyActive = useMemo(() => {
    return ["true", null].includes(searchParams.get("only_active"));
  }, [searchParams]);

  const currentPage = useMemo(() => {
    return parseInt(searchParams.get("page") || 1);
  }, [searchParams]);

  const selectedOrder = useMemo(() => {
    return EXP_ORDER_BY.find((item) => item.key === searchParams.get("order"));
  }, [searchParams]);

  useEffect(() => {
    setValue("query", searchParams.get("query"));
    setValue("exp_type", searchParams.get("exp_type"));
    setValue("only_active", isOnlyActive);
    setValue("page_size", searchParams.get("page_size") || 12);
    setValue("order", searchParams.get("order"));
    setValue("autosubmit_version", searchParams.get("autosubmit_version"));
    setValue("owner", searchParams.get("owner"));
    setValue("hpc", searchParams.get("hpc"));
  }, [searchParams]);

  const { data, isFetching, isError, refetch } = useGetExperimentsQuery({
    page: searchParams.get("page") || undefined,
    page_size: searchParams.get("page_size") || undefined,
    query: searchParams.get("query") || undefined,
    only_active: isOnlyActive,
    exp_type: searchParams.get("exp_type") || undefined,
    autosubmit_version: searchParams.get("autosubmit_version") || undefined,
    owner: searchParams.get("owner") || undefined,
    hpc: searchParams.get("hpc") || undefined,
    order_by: selectedOrder?.order_by || undefined,
    order_desc: selectedOrder?.order_desc || undefined,
  });

  // Form Handlers
  const onSubmit = (data) => {
    const newParams = {
      ...searchParamsToKeyValue(searchParams),
      page: 1,
      query: data.query,
      exp_type: data.exp_type,
      only_active: data.only_active,
      order: data.order,
      page_size: data.page_size,
      autosubmit_version: data.autosubmit_version,
      owner: data.owner,
      hpc: data.hpc,
    };
    [
      "query",
      "exp_type",
      "order",
      "page_size",
      "autosubmit_version",
      "owner",
      "hpc",
    ].forEach((key) => {
      if (!newParams[key]) {
        delete newParams[key];
      }
    });
    setSearchParams(newParams);
  };

  const handleClear = () => {
    setValue("query", "");
    setValue("autosubmit_version", "");
    setValue("owner", "");
    setValue("hpc", "");
    handleSubmit(onSubmit)();
  };

  const handleChangeOnlyActive = () => {
    setValue("only_active", !isOnlyActive);
    handleSubmit(onSubmit)();
  };

  const handleChangePage = (e) => {
    const nextPage = e.selected;
    if (nextPage <= data?.pagination?.total_pages && nextPage > 0) {
      setSearchParams({
        ...searchParamsToKeyValue(searchParams),
        page: nextPage,
      });
    }
  };

  return (
    <>
      <div className="grow w-full flex flex-col gap-4">
        <div className="flex w-full gap-2 flex-wrap items-start">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grow flex flex-wrap items-start"
          >
            <div className="grow flex flex-col gap-1">
              <div className="grow relative">
                <input
                  {...register("query")}
                  id="search-input"
                  className="w-full form-input rounded-e-none"
                  placeholder="Search by expid, description, or owner..."
                />
                <button
                  type="button"
                  className="absolute right-0 h-full px-3 opacity-50 text-black"
                  onClick={toggleMoreFilters}
                >
                  more filters{" "}
                  <i
                    className={cn(
                      "fa-solid",
                      showMoreFilters ? "fa-caret-up" : "fa-caret-down"
                    )}
                  ></i>
                </button>
              </div>
              {showMoreFilters && (
                <>
                  <input
                    {...register("autosubmit_version")}
                    id="search-as-version-input"
                    className="grow form-input"
                    placeholder="Search by autosubmit version"
                  />
                  <input
                    {...register("owner")}
                    id="search-input"
                    className="grow form-input"
                    placeholder="Search by owner"
                  />
                  <input
                    {...register("hpc")}
                    id="search-input"
                    className="grow form-input"
                    placeholder="Search by HPC platform"
                  />
                </>
              )}
            </div>

            <button
              id="search-btn"
              type="submit"
              className="btn btn-dark font-bold px-6 border border-dark rounded-none"
            >
              Search
            </button>
            <button
              id="search-clear"
              className="btn btn-light font-bold px-6 border rounded-s-none"
              onClick={handleClear}
            >
              Clear
            </button>
          </form>
          <button
            className="btn btn-success h-8"
            title="Refresh data"
            onClick={() => {
              refetch();
            }}
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>

          <IntervalButton className={"h-8"} intervalCallback={refetch} />
        </div>

        <div className="flex gap-x-8 gap-y-3 items-center flex-wrap">
          <div className="flex gap-4 items-center mx-4">
            <label className="text-nowrap">Type:</label>
            <select
              id="experiment-type-select"
              className="form-select border border-primary text-primary dark:bg-primary dark:text-white font-bold text-center text-sm"
              {...register("exp_type", {
                onChange: handleSubmit(onSubmit),
              })}
            >
              <option value="">All</option>
              <option value="experiment">Experiment</option>
              <option value="operational">Operational</option>
              <option value="test">Test</option>
            </select>
          </div>
          <div className="flex gap-4 items-center mx-4">
            <Switch
              id="only-active-switch"
              checked={isOnlyActive}
              onChange={handleChangeOnlyActive}
              className={`${
                isOnlyActive
                  ? "bg-primary"
                  : "bg-neutral-200 dark:bg-neutral-700"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  isOnlyActive ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <label
              className="text-nowrap cursor-pointer"
              onClick={handleChangeOnlyActive}
            >
              Only active
            </label>
          </div>

          <div className="ms-auto flex flex-wrap gap-3 items-center">
            <label className="text-nowrap">Order by:</label>
            <select
              id="order-by-select"
              className="form-select border border-primary text-primary dark:bg-primary dark:text-white font-bold text-center text-sm"
              {...register("order", {
                onChange: handleSubmit(onSubmit),
              })}
            >
              <option value="">Default</option>
              {EXP_ORDER_BY.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.name}
                </option>
              ))}
            </select>
            <label className="text-nowrap ms-2">Page size:</label>
            <select
              id="page-size-select"
              className="form-select border border-primary text-primary dark:bg-primary dark:text-white font-bold text-center text-sm"
              {...register("page_size", {
                onChange: handleSubmit(onSubmit),
              })}
            >
              {/* <option value={6}>6</option> */}
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>

        <div className="grow flex flex-col">
          {isFetching ? (
            <div className="grow w-full flex items-center justify-center">
              <div className="spinner-border" role="status"></div>
            </div>
          ) : (
            <>
              {isError || data?.error ? (
                <div className="text-danger w-full grow flex flex-col gap-8 items-center justify-center">
                  <i className="fa-solid fa-x text-9xl"></i>
                  <div className="text-2xl">
                    {"Error while fetching experiments"}
                  </div>
                </div>
              ) : data?.experiments?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
                  {data.experiments.map((exp) => {
                    return (
                      <div key={exp.name}>
                        <ExperimentCard experiment={exp} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full grow flex flex-col gap-8 items-center justify-center text-neutral-700 dark:text-neutral-100">
                  <i className="fa-solid fa-ban text-9xl"></i>
                  <div className="text-2xl">No experiments found</div>
                  {isOnlyActive && (
                    <div className="alert bg-primary-500 text-white border-0 font-semibold py-2 px-3 ">
                      <i className="fa-solid fa-circle-info me-2"></i> Try to
                      switch off the "Only active" option
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {!isFetching && data?.pagination?.total_pages > 0 && currentPage && (
          <div className="flex gap-2 justify-center items-center">
            <Paginator
              currentPage={currentPage}
              onPageClick={handleChangePage}
              totalPages={data.pagination.total_pages}
              siblingSize={width >= 640 ? 2 : 1}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
