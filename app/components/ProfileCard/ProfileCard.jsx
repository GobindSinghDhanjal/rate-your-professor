import { useState, useMemo, useRef } from "react";
import {
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import Image from "next/image";
import styles from "./ProfileCard.module.css";
import BasicAlerts from "@/app/reviewaddprofessor/BasicAlert";

const TITLE_OPTIONS = [
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Ph.D. Scholar",
];

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_PASSCODE = process.env.NEXT_PUBLIC_PASSCODE;

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(
      err?.error?.message || "Failed to upload image to Cloudinary.",
    );
  }

  const data = await response.json();
  // Return both the URL and the public_id (needed to delete later)
  return { url: data.secure_url, publicId: data.public_id };
};

const ProfileCard = ({ handleClick, profile }) => {
  const [passcode, setPasscode] = useState("");
  const [basicAlert, setBasicAlert] = useState({ display: false, alert: {} });
  const [editedProfile, setEditedProfile] = useState(profile);
  const [loadingAction, setLoadingAction] = useState(null); // "add" | "remove" | "upload" | "delete-image" | null

  // ── Image upload section state ──
  const [uploadPasscode, setUploadPasscode] = useState("");
  const [uploadPasscodeError, setUploadPasscodeError] = useState("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null); // local blob URL while uploading
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(null); // stored to allow deletion

  const universityImageInputRef = useRef(null);
  const defaultAvatarIndex = useMemo(
    () => Math.floor(Math.random() * 5) + 1,
    [],
  );

  const isLoading = loadingAction !== null;
  const {
    id,
    name,
    title,
    gender,
    college,
    university,
    image,
    universityImageUrl,
  } = editedProfile;

  const handleFieldChange = (event, fieldName) => {
    setEditedProfile((prev) => ({ ...prev, [fieldName]: event.target.value }));
  };

  const showAlert = (severity, message) => {
    setBasicAlert({ display: true, alert: { severity, message } });
  };

  // Called when user clicks "Upload Image" — validates passcode first,
  // then opens the file picker. The actual upload happens in handleUniversityImageUpload.
  const handleUploadButtonClick = () => {
    setUploadPasscodeError("");

    if (!uploadPasscode.trim()) {
      setUploadPasscodeError("Please enter the upload passcode.");
      return;
    }

    if (uploadPasscode.trim() !== UPLOAD_PASSCODE) {
      setUploadPasscodeError("Incorrect passcode. Image upload not allowed.");
      return;
    }

    // Passcode is correct — open file picker
    universityImageInputRef.current?.click();
  };

  const handleUniversityImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setUploadedImagePreview(localPreview);
    setBasicAlert({ display: false, alert: {} });
    setLoadingAction("upload");

    try {
      const { url, publicId } = await uploadToCloudinary(file);

      setCloudinaryPublicId(publicId);
      setEditedProfile((prev) => ({ ...prev, universityImageUrl: url }));
      setUploadedImagePreview(null);
      showAlert("success", "University image uploaded successfully.");
    } catch (error) {
      setUploadedImagePreview(null);
      URL.revokeObjectURL(localPreview);
      showAlert("error", error.message);
    } finally {
      setLoadingAction(null);
      if (universityImageInputRef.current)
        universityImageInputRef.current.value = "";
    }
  };

  // Deletes the image from Cloudinary via the Next.js API route, then clears local state.
  const handleClearUniversityImage = async () => {
    setUploadedImagePreview(null);

    // If this image was uploaded to Cloudinary this session, delete it there too
    if (cloudinaryPublicId) {
      setLoadingAction("delete-image");
      try {
        const response = await fetch("/api/deleteUniversityImage", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: cloudinaryPublicId }),
        });

        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            body?.msg || "Failed to delete image from Cloudinary.",
          );
        }

        showAlert("success", body?.msg || "Image deleted successfully.");
      } catch (error) {
        showAlert("error", error.message);
      } finally {
        setLoadingAction(null);
        setCloudinaryPublicId(null);
      }
    }

    setEditedProfile((prev) => ({ ...prev, universityImageUrl: "" }));
    setUploadPasscode("");
    setUploadPasscodeError("");
    if (universityImageInputRef.current)
      universityImageInputRef.current.value = "";
  };

  const renderAvatar = () => {
    if (image) return <Avatar src={image} sx={{ width: 70, height: 70 }} />;
    const defaultAvatar =
      gender === "Male"
        ? `/images/man/man-${defaultAvatarIndex}.png`
        : `/images/woman/woman-${defaultAvatarIndex}.png`;
    return <Image src={defaultAvatar} alt={name} width={70} height={70} />;
  };

  const handleRemoveButtonClick = async () => {
    if (isLoading) return;
    if (!passcode.trim()) {
      showAlert("error", "Please enter the passcode before removing.");
      return;
    }

    setLoadingAction("remove");
    setBasicAlert({ display: false, alert: {} });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/tempProfessor`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, passcode }),
        },
      );

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          body?.msg || body?.message || "Failed to remove professor.",
        );
      }

      showAlert("success", body?.msg || "Professor removed successfully.");
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAddButtonClick = async () => {
    if (isLoading) return;
    if (!passcode.trim()) {
      showAlert("error", "Please enter the passcode before adding.");
      return;
    }

    setLoadingAction("add");
    setBasicAlert({ display: false, alert: {} });

    try {
      const data = {
        id,
        name,
        title,
        gender,
        collegeName: college,
        universityName: university,
        universityImageUrl: universityImageUrl || "",
        department: editedProfile.department || "",
        subjects: editedProfile.subjects || "",
        passcode,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          body?.msg || body?.message || "Failed to add professor.",
        );
      }

      setPasscode("");
      showAlert("success", body?.msg || "Professor added successfully.");
      handleClick(data);
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const imagePreviewSrc = uploadedImagePreview || universityImageUrl || null;
  const isImageActionLoading =
    loadingAction === "upload" || loadingAction === "delete-image";

  return (
      <div className={styles.card}>
        <Grid container spacing={2}>
          {/* Avatar */}
          <Grid item xs={12} sm={6} md={4}>
            {renderAvatar()}
          </Grid>
          {/* Profile details */}
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              id="name"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => handleFieldChange(e, "name")}
              multiline
              maxRows={4}
            />
            <FormControl sx={{ mt: 3 }} fullWidth>
              <InputLabel id="title-label">Title</InputLabel>
              <Select
                sx={{ width: "230px" }}
                labelId="title-label"
                value={title}
                onChange={(e) => handleFieldChange(e, "title")}
                label="Title"
                variant="outlined"
                required
              >
                {TITLE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ mt: 3 }} fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                sx={{ width: "230px" }}
                value={gender}
                onChange={(e) => handleFieldChange(e, "gender")}
                label="Gender"
                variant="outlined"
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              id="college"
              sx={{ mt: 3 }}
              label="College"
              variant="outlined"
              value={college}
              onChange={(e) => handleFieldChange(e, "college")}
              multiline
              maxRows={4}
            />

            <TextField
              fullWidth
              id="university"
              sx={{ mt: 3 }}
              label="University"
              variant="outlined"
              value={university}
              onChange={(e) => handleFieldChange(e, "university")}
              multiline
              maxRows={4}
            />

            {/* University Image URL — auto-filled after Cloudinary upload, or paste manually */}
            <TextField
              fullWidth
              id="universityImageUrl"
              sx={{ mt: 3 }}
              label="University Image URL"
              variant="outlined"
              value={universityImageUrl || ""}
              onChange={(e) => handleFieldChange(e, "universityImageUrl")}
              multiline
              maxRows={4}
              helperText="Upload an image below to fill this automatically, or paste a URL directly."
            />

            {/* ── Image upload gate: passcode must match before file picker opens ── */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <TextField
                label="Upload Passcode"
                variant="outlined"
                size="small"
                type="password"
                value={uploadPasscode}
                onChange={(e) => {
                  setUploadPasscode(e.target.value);
                  if (uploadPasscodeError) setUploadPasscodeError("");
                }}
                error={!!uploadPasscodeError}
                helperText={uploadPasscodeError || " "}
                disabled={isImageActionLoading || !!imagePreviewSrc}
                sx={{ width: 200 }}
              />

              <Button
                variant="outlined"
                size="medium"
                onClick={handleUploadButtonClick}
                disabled={isImageActionLoading || !!imagePreviewSrc}
                startIcon={
                  loadingAction === "upload" ? (
                    <CircularProgress size={14} />
                  ) : null
                }
                sx={{ mt: 0.25 }}
              >
                {loadingAction === "upload" ? "Uploading…" : "Upload Image"}
              </Button>

              {/* Hidden file input — triggered programmatically after passcode check */}
              <input
                ref={universityImageInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUniversityImageUpload}
              />
            </Box>

            {/* Preview + Clear */}
            {imagePreviewSrc && (
              <Box
                sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <Box
                  component="img"
                  src={imagePreviewSrc}
                  alt="University"
                  sx={{
                    height: 44,
                    width: "auto",
                    borderRadius: 1,
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    opacity: isImageActionLoading ? 0.5 : 1,
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {loadingAction === "delete-image" ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} color="error" />
                    <Typography variant="body2" color="error">
                      Deleting…
                    </Typography>
                  </Box>
                ) : (
                  !isImageActionLoading && (
                    <Button
                      size="small"
                      color="error"
                      onClick={handleClearUniversityImage}
                    >
                      Clear
                    </Button>
                  )
                )}
              </Box>
            )}

            <TextField
              fullWidth
              id="department"
              sx={{ mt: 3 }}
              label="Department"
              variant="outlined"
              value={editedProfile.department || ""}
              onChange={(e) => handleFieldChange(e, "department")}
              multiline
              maxRows={4}
            />

            <TextField
              fullWidth
              id="subjects"
              sx={{ mt: 3 }}
              label="Subjects (comma separated)"
              variant="outlined"
              value={editedProfile.subjects || ""}
              onChange={(e) => handleFieldChange(e, "subjects")}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2, mb: 2 }} />

        {basicAlert.display && <BasicAlerts alert={basicAlert.alert} />}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} lg={8}>
              <TextField
                id="passcode"
                label="Passcode"
                variant="outlined"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={6} lg={2} sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="error"
                sx={{
                  fontSize: "1.1rem",
                  borderRadius: "15px",
                  padding: "11px 25px",
                  minWidth: 130,
                }}
                onClick={handleRemoveButtonClick}
                disabled={isLoading}
              >
                {loadingAction === "remove" ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={18} color="inherit" />
                    <Typography sx={{ fontSize: "inherit" }}>
                      Removing…
                    </Typography>
                  </Box>
                ) : (
                  "Remove"
                )}
              </Button>
            </Grid>

            <Grid item xs={6} lg={2} sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  fontSize: "1.1rem",
                  borderRadius: "15px",
                  padding: "11px 25px",
                  minWidth: 130,
                }}
                onClick={handleAddButtonClick}
                disabled={isLoading}
              >
                {loadingAction === "add" ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={18} color="inherit" />
                    <Typography sx={{ fontSize: "inherit" }}>
                      Adding…
                    </Typography>
                  </Box>
                ) : (
                  "Add"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
  );
};

export default ProfileCard;
