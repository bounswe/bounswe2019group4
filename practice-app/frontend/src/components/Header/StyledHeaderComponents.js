import { Menu, Button, Input } from "semantic-ui-react";
import styled from "styled-components";

export const HeaderMenu = styled.div`
  display: flex !important;
  justify-content: left;
  height: 64px !important;
  width: 100% !important;
  font-size: 16px !important;
  line-height: 64px !important;
  background-color: rgba(62,149,64,0.6) !important;
  border-bottom: 0px !important;
`

export const MenuItem = styled(Menu.Item)`
  border-bottom: none !important;
  height: 64px !important;
    flex-shrink: 1;

`

export const MenuButton = styled(Button)`
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  font-size: 16px !important;
  padding: 5px;
  font-weight: bold !important;
  float: right;
  color: rgb(12,74,14) !important;
  flex-shrink: 1;
  font-family: "Times New Roman", Times, serif;
`

export const MenuInput = styled(Input)`
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  font-size: 16px !important;
  font-weight: bold !important;
  height: 32px !important;
  float: right;
  color: rgb(12,74,14) !important;
  flex-shrink: 1;
  font-family: "Times New Roman", Times, serif;
`