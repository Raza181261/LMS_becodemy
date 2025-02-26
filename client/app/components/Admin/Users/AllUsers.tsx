import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllUsersQuery } from "../../../../redux/features/user/userApi";
import { styles } from "../../../../app/styles/style";

type Props = {
  isTeam: boolean;
};

const AllCourses: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  //const { isLoading, data,refetch } = useGetAllUsersQuery({},{refetchOnMountOrArgChang:true});
  const { isLoading, data } = useGetAllUsersQuery({ page: 1 });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  // const [updateUserRole,{error:updateError,isSuccess}] = useUpdateUserRoleMutation();
  // const [delete,{isSuccess:deleteSuccess, error:deleteError}] = useDeleteUserMutation({})


  //  useEffect(() => {
  //   if(updateError){
  //     if("data" in updateError){
  //       const errorMessage = updateError as any
  //       toast.error(errorMessage.data.message)
  //     }
  //   }
  //   if(isSuccess){
  //      refetch()
  //     toast.success("User role update successfully")
  //     setActive(false)
  //   }
  //   if(deleteSuccess){
  //     refetch()
  //     toast.success("Delete user successfully!")
  //     setOpen(false)
  //   }
  //   if(deleteError){
  //     if("data" in deleteError){
  //       const errorMessage = deleteError as any
  //       toast.error(errorMessage.data.message)
  //     }
  //   }
  // },[updateError,isSuccess,deleteSuccess,deleteError])

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.5 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpen(!open);
            setUserId(params.row.id);
          }}
        >
          <AiOutlineDelete className="text-black dark:text-white" size={20} />
        </Button>
      ),
    },

    {
      field: "mail",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <a href={`mailto:${params.row.email}`}>
              <AiOutlineMail
                className="text-black dark:text-white mt-4"
                size={20}
              />
            </a>
          </>
        );
      },
    },
  ];

  // const rows = data
  //   ? data.users.map((item: any) => ({
  //       id: item._id,
  //       name: item.name,
  //       email: item.email,
  //       role: item.role,
  //       courses: item.courses.length,
  //       created_at: format(item.createdAt),
  //     }))
  //   : [];

  // const rows:any = [];
  // if(isTeam){
  //   const newData = data && data.users.filter((item:any) => item.role=== "admin");

  //   newData
  //     && newData.forEach((item: any) => {
  //       rows.push({
  //         id: item._id,
  //         name: item.name,
  //         email: item.email,
  //         role: item.role,
  //         courses: item.courses.length,
  //         created_at: format(item.createdAt),
  //       })
  //       })

  // } else {
  //   data
  //   && data.users.forEach((item: any) => {
  //     rows.push({
  //       id: item._id,
  //       name: item.name,
  //       email: item.email,
  //       role: item.role,
  //       courses: item.courses.length,
  //       created_at: format(item.createdAt),
  //     })
  //     })
  // }

  const rows: any = [];

  if (isTeam) {
    const newData =
      data && data.users.filter((item: any) => item.role === "admin");

    if (newData) {
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
    }
  } else {
    if (data) {
      data.users.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
    }
  }

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-[200px] text-[#ffffffdc] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`}
              onClick={() => setActive(!active)}
            >
              Add New Member
            </div>
          </div>
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                borderBottom: "none",
                color: theme === "dark" ? "#000" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark" ? `#b7ebde !important` : `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
