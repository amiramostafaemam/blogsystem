import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { getPopularTags } from "../../api/posts";
import { normalizeTag } from "../../utils";

const MAX_TAGS = 5;

function TagInput({ value, onChange }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getPopularTags(30)
      .then((rows) => setOptions(rows.map((r) => r.tag)))
      .catch(() => {});
  }, []);

  const handleChange = (_, tags) => {
    const clean = [...new Set(tags.map(normalizeTag).filter(Boolean))].slice(0, MAX_TAGS);
    onChange(clean);
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      autoSelect
      options={options}
      value={value}
      onChange={handleChange}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tags"
          placeholder={value.length < MAX_TAGS ? "Add a tag and press Enter" : ""}
          helperText={`${value.length}/${MAX_TAGS} · helps readers find your story`}
        />
      )}
    />
  );
}

export default TagInput;
