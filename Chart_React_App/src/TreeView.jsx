import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChevronRight,
  MdKeyboardArrowDown,
  MdAddBox,
  MdIndeterminateCheckBox
} from "react-icons/md";

export class TreeView extends React.Component {

  constructor() {
    super();
    this.state = {
      checked: [],
      expanded: [],
      selectedNodes: []
    }
  }

  static propTypes = {
    treeViewData: PropTypes.array,
    prepareChartData: PropTypes.func
  }

  setOptions = (checked, targetNode) => {
    this.setState({ checked });
  }

  updateTreeObj = (viewData) => {
    let selectedIds = this.state.checked;
    viewData.forEach(obj => {
      if (selectedIds.includes(obj.value))
        obj.flag = true;
      else
        obj.flag = false;

      if (obj.children && obj.children.length) {
        this.updateTreeObj(obj.children)
      }
    });
    return viewData;
  }

  applyFilters = () => {
    let updatedTreeData = this.updateTreeObj(this.props.treeViewData);
    this.props.prepareChartData(updatedTreeData);
  }

  render() {

    const icons = {
      check: <MdCheckBox className="rct-icon rct-icon-check" />,
      uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
      halfCheck: (
        <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
      ),
      expandClose: (
        <MdChevronRight className="rct-icon rct-icon-expand-close" />
      ),
      expandOpen: (
        <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />
      ),
      expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
      collapseAll: (
        <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />
      ),
      parentClose: "",
      parentOpen: "",
      leaf: ""
    };

    return (
      <div>
        <CheckboxTree
          nodes={this.props.treeViewData}
          checked={this.state.checked}
          expanded={this.state.expanded}
          onCheck={(checked, targetNode) => this.setOptions(checked, targetNode)}
          onExpand={expanded => this.setState({ expanded })}
          icons={icons}
        />
        <br />
        <br />

        &nbsp;&nbsp; &nbsp;
        <Button variant="outlined" color="primary" href="#outlined-buttons" onClick={() => { this.applyFilters() }}>
          Apply
</Button>
      </div>
    );
  }
}

export default TreeView