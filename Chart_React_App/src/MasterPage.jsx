import React, {
  useState,
  useEffect
} from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  useTheme
} from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import filters from './filters.js';
import TreeView from './TreeView';
import ViewChart from './ViewChart';


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function MasterPage() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [stackedBarChart, setStackedBarChart] = useState(true);
  const [barChart, setBarChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [treeViewData, setTreeViewData] = useState([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };


  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getTreeData = (data) => {
    let treeData = []
    if (data && data.length) {
      data.map(category => {
        let catObj = {
          label: category.name,
          value: category.id,
          flag: true
        };
        let filterOptions = JSON.parse(JSON.stringify(filters));
        filterOptions.map(filObj => filObj.value = `${category.id}_${filObj.value}`);
        catObj.children = filterOptions;
        treeData.push(catObj);
      })
    }
    return treeData;
  }

  const calculateSum = (filterData, filterOption) => {
    let sum = 0;
    if (filterData && filterData.length) {
      filterData.map(obj => {
        if (obj[filterOption])
          sum = sum + obj[filterOption];
        if (obj.items && obj.items.length)
          sum = sum + calculateSum(obj.items, filterOption);
      })
    }
    return sum;
  }


  const calculateData = (filterData, filterOption, flag) => {
    if (flag)
      return calculateSum(filterData, filterOption);
    return 0;
  }

  const prepareChartData = (treeData, initialData) => {
    let fullChartData = [];
    if (treeData && treeData.length) {
      treeData.map(treeObj => {
        let tempChartData = [];
        tempChartData.push(treeObj.label);
        let filterData;
        if (initialData)
          filterData = initialData.filter(filterObj => filterObj.id === treeObj.value);
        else
          filterData = productsData.filter(filterObj => filterObj.id === treeObj.value);
        treeObj.children && treeObj.children.map(childObj => {
          const sumValue = calculateData(filterData, childObj.label.toLowerCase(), childObj.flag)
          tempChartData.push(sumValue);
        });
        fullChartData.push(tempChartData)
      })
    }
    setChartData(fullChartData);
  }

  useEffect(() => {
    fetch('./data.json').then(response => {
      return response.json();
    }).then(data => {
      setProductsData(data);
      let parseTreeData = getTreeData(data);
      setTreeViewData(parseTreeData);
      prepareChartData(parseTreeData, data);
    })
  }, []);


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: open, })}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}>
            <MenuIcon />
          </IconButton>
          <div className="h3">Products Report</div>
        </Toolbar>
      </AppBar>
      <Drawer className={classes.drawer} variant="persistent" anchor="left" open={open} classes={{
          paper: classes.drawerPaper,
        }}>

        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ?
            <ChevronLeftIcon /> :
            <ChevronRightIcon />}
          </IconButton>
        </div>

        <Divider />
        <br />
        <br />
        <br />
        {treeViewData && treeViewData.length > 0}
        <TreeView treeViewData={treeViewData} prepareChartData={prepareChartData} />
      </Drawer>
      <main className={clsx(classes.content, { [classes.contentShift]: open, })}>
        <div className={classes.drawerHeader} />

        <FormGroup row>
          <FormControlLabel control={ <Checkbox checked={stackedBarChart} size="small" color="default" value="BarChart"
            onChange={()=> setStackedBarChart(!stackedBarChart)} />
            }
            label="Stacked Chart"
            />
            <FormControlLabel control={ <Checkbox checked={barChart} size="small" color="default" value="Bar"
              onChange={()=> setBarChart(!barChart)} />
              }
              label="Bar Chart"
              />
        </FormGroup>
        <hr>
        </hr>
        <br />
        <div>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                {chartData && stackedBarChart &&
                <ViewChart chartData={chartData} chartType='BarChart' />}
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                {chartData && barChart &&
                <ViewChart chartData={chartData} chartType='Bar' />}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </main>
    </div>
  );
}