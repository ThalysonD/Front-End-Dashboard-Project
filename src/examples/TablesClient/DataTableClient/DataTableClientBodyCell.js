import PropTypes from "prop-types";
import MDBox from "components/MDBox";

function DataTableClientBodyCell({ noBorder, align, children }) {
  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
      })}
    >
      <MDBox
        display="inline-block"
        width="max-content"
        color="text"
        sx={{ verticalAlign: "middle" }}
      >
        {children}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of DataTableClientBodyCell
DataTableClientBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
};

// Typechecking props for the DataTableClientBodyCell
DataTableClientBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
};

export default DataTableClientBodyCell;
