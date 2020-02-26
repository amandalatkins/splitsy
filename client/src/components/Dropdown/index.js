import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const DropDown = props => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  function switchSort(type) {
    if (type === "none") {
      props.sort(null);
    } else if (type === "amount") {
      props.sort({ by: "total", type: "DESC" });
    } else if (type === "date") {
      props.sort({ by: "date", type: "DESC" });
    } else if (type === "title") {
      props.sort({ by: "label", type: "ASC" });
    }
  }

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>{props.title}</DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          onClick={() => {
            switchSort("none");
          }}
        >
          Default
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            switchSort("amount");
          }}
        >
          Amount
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            switchSort("date");
          }}
        >
          Date
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            switchSort("title");
          }}
        >
          Title
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDown;
