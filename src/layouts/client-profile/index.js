import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import Header from "layouts/client-profile/Header";
import { useParams } from "react-router-dom";
import { getProfile, updateProfile, deleteClient } from "services/clientService";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";

const ClientProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [client, setClient] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    phone: "",
    cpf: "",
  });

  const [errors, setErrors] = useState({
    nameError: false,
    emailError: false,
    newPassError: false,
    confirmPassError: false,
  });

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteClient(id);
      navigate("/clients");
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token de autenticação não encontrado. Usuário não está logado.");
      return;
    }

    const fetchClientData = async () => {
      const profileData = await getProfile(id);
      setClient({
        name: profileData.nome ?? "",
        email: profileData.email ?? "",
        phone: profileData.telefone ?? "",
        cpf: profileData.cpf ?? "",
      });
    };

    fetchClientData();
  }, [id]);

  const changeHandler = (e) => {
    setClient({
      ...client,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setIsError(false);

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let hasError = false;

    if (client.name.trim().length === 0) {
      setErrors((prevErrors) => ({ ...prevErrors, nameError: true }));
      hasError = true;
    }

    if (client.email.trim().length === 0 || !client.email.trim().match(mailFormat)) {
      setErrors((prevErrors) => ({ ...prevErrors, emailError: true }));
      hasError = true;
    }

    if (client.confirmPassword || client.newPassword) {
      if (client.confirmPassword.trim() !== client.newPassword.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassError: true }));
        hasError = true;
      }
      if (client.newPassword.trim().length < 8) {
        setErrors((prevErrors) => ({ ...prevErrors, newPassError: true }));
        hasError = true;
      }
    }

    if (!hasError) {
      try {
        const updatedData = {
          nome: client.name,
          email: client.email,
          telefone: client.phone,
          cpf: client.cpf,
        };
        await updateProfile(updatedData, id);
        setIsSuccess(true);

        setTimeout(() => {
          setIsSubmitting(false);
          setTimeout(() => {
            setIsSuccess(false);
            setIsEditable(false);
          }, 1000);
        }, 500);
      } catch (error) {
        setIsError(true);
        console.error("Erro ao atualizar perfil:", error);
        setTimeout(() => {
          setIsSubmitting(false);
          setTimeout(() => {
            setIsError(false);
            setIsEditable(false);
          }, 1000);
        }, 500);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={client.name}>
        {isSuccess && (
          <MDAlert color="success" mt="20px">
            <MDTypography variant="body2" style={{ color: "white", fontWeight: "bold" }}>
              Profile updated successfully.
            </MDTypography>
          </MDAlert>
        )}
        {isError && (
          <MDAlert color="error" mt="20px">
            <MDTypography variant="body2">Error updating profile. Please try again.</MDTypography>
          </MDAlert>
        )}
        <MDBox
          component="form"
          role="form"
          onSubmit={submitHandler}
          display="flex"
          flexDirection="column"
        >
          <MDBox display="flex" flexDirection="row" mt={5} mb={3}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              mr={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Name
              </MDTypography>
              <MDBox mb={2} width="100%">
                <MDInput
                  type="text"
                  fullWidth
                  name="name"
                  value={client.name}
                  onChange={changeHandler}
                  error={errors.nameError}
                  disabled={!isEditable}
                />
                {errors.nameError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The name cannot be null
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>

            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              ml={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Email
              </MDTypography>
              <MDBox mb={1} width="100%">
                <MDInput
                  type="email"
                  fullWidth
                  name="email"
                  value={client.email}
                  onChange={changeHandler}
                  error={errors.emailError}
                  disabled={!isEditable}
                />
                {errors.emailError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The email must be valid
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
          </MDBox>

          <MDBox display="flex" flexDirection="row" mb={3}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              mr={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Phone
              </MDTypography>
              <MDBox mb={2} width="100%">
                <MDInput
                  type="text"
                  fullWidth
                  name="phone"
                  value={client.phone}
                  onChange={changeHandler}
                  disabled={!isEditable}
                />
              </MDBox>
            </MDBox>

            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              ml={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                CPF
              </MDTypography>
              <MDBox mb={1} width="100%">
                <MDInput
                  type="text"
                  fullWidth
                  name="cpf"
                  value={client.cpf}
                  onChange={changeHandler}
                  disabled={!isEditable}
                />
              </MDBox>
            </MDBox>
          </MDBox>

          <MDBox mt={4} display="flex" justifyContent="space-between">
            <MDBox display="flex">
              <MDButton variant="gradient" color="info" onClick={handleEdit}>
                Edit
              </MDButton>
              <MDButton
                variant="gradient"
                color="error"
                onClick={handleDeleteClick}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color={isError ? "error" : isSuccess ? "success" : "info"}
              type="submit"
              endIcon={
                isSubmitting ? (
                  <CircularProgress size={20} />
                ) : isError ? (
                  <ErrorIcon />
                ) : isSuccess ? (
                  <CheckIcon />
                ) : (
                  <SendIcon />
                )
              }
              disabled={isSubmitting || isSuccess}
            >
              Save changes
            </MDButton>
          </MDBox>
        </MDBox>
      </Header>
      <Footer />
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza de que deseja excluir este perfil?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setDeleteConfirmOpen(false)} color="info">
            Não
          </MDButton>
          <MDButton onClick={handleConfirmDelete} color="error" autoFocus>
            Sim
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ClientProfile;
