/* eslint-disable no-case-declarations */
import { AnyAction } from "redux"
import { CloudreveFile } from "../../types";

interface SelectProps {
  isMultiple: boolean;
  withFolder: boolean;
  withFile: boolean;
  withExtra: boolean;
}

export interface ExplorerState {
  dndSignal: boolean;
  dndTarget: any;
  dndSource: any;
  fileList: CloudreveFile[];
  dirList: CloudreveFile[];
  selected: CloudreveFile[];
  selectProps: SelectProps;
  lastSelect: {
    file: CloudreveFile;
    index: number;
  };
  shiftSelectedIds: string[];
  imgPreview: {
      first: CloudreveFile;
      other: [];
  };
  keywords: string;
  fileSave: boolean;
}

export const initState: ExplorerState = {
  dndSignal: false,
  dndTarget: null,
  dndSource: null,
  fileList: [],
  dirList: [],
  selected: [],
  selectProps: {
      isMultiple: false,
      withFolder: false,
      withFile: false,
      withExtra: false,
  },
  lastSelect: {
    file: {
      id: '',
      name: '',
      size: 0,
      type: 'file',
      date: '',
      access: ''
    },
    index: -1,
  },
  shiftSelectedIds: [],
  imgPreview: {
      first: {
        id: '',
        name: '',
        size: 0,
        type: 'file',
        date: '',
        access: ''
      },
      other: []
  },
  keywords: '',
  fileSave: false
}

const checkSelectedProps = (selected: CloudreveFile[], withExtra: boolean): SelectProps =>{
  const isMultiple = selected.length > 1;
  let withFolder = false
  let withFile = false
  selected.forEach((value)=>{
      if(value.type === "dir"){
          withFolder = true;
      }else if(value.type === "file"){
          withFile = true;
      }
  })
  return {
    isMultiple,
    withFolder,
    withFile,
    withExtra
  }
}

const explorer = (state: ExplorerState = initState, action: AnyAction): ExplorerState => {
  switch (action.type) {
    case 'DRAG_AND_DROP':
      return Object.assign({}, state, {
        dndSignal: !state.dndSignal,
        dndTarget: action.target,
        dndSource: action.source,
      });
    case 'SET_FILE_LIST':
      return Object.assign({}, state, {
        fileList: action.list,
      });
    case 'SET_DIR_LIST':
      return Object.assign({}, state, {
        dirList: action.list,
      });
    case 'ADD_SELECTED_TARGETS':
      const addedSelected = [...state.selected,...action.targets]
      return Object.assign({}, state, {
        selected: addedSelected,
        selectProps: checkSelectedProps(addedSelected, action.extra != null)
      });
    case 'SET_SELECTED_TARGET':
      const newSelected = action.targets
      return Object.assign({}, state, {
        selected: newSelected,
        selectProps: checkSelectedProps(newSelected, action.extra != null)
      });
    case 'RMOVE_SELECTED_TARGETS':
      const { fileIds } = action
      const filteredSelected = state.selected.filter((file) => {
        return !fileIds.includes(file.id)
      })
      return Object.assign({}, state, {
        selected: filteredSelected,
        selectProps: checkSelectedProps(filteredSelected, action.extra != null)
      });
    case 'REFRESH_FILE_LIST':
      return Object.assign({}, state, {
        selected:[],
        selectProps: {
            isMultiple: false,
            withFolder: false,
            withFile: false,
        }
      });
    case 'SEARCH_MY_FILE':
      return Object.assign({}, state, {
        selected:[],
        selectProps: {
            isMultiple: false,
            withFolder: false,
            withFile: false,
        },
        keywords: action.keywords,
      });
    case 'SHOW_IMG_PREIVEW':
        return Object.assign({}, state, {
          imgPreview: {
            first: action.first,
            other: state.fileList,
          },
        });
    case 'SAVE_FILE':
        return {
          ...state,
          fileSave: !state.fileSave,
        }
    case 'SET_LAST_SELECT':
          const { file, index } = action
          return {
            ...state,
            lastSelect: {
              file,
              index,
            },
          }
    case 'SET_SHIFT_SELECTED_IDS':
            const { shiftSelectedIds } = action
            return {
              ...state,
              shiftSelectedIds,
            }
    case 'SET_NAVIGATOR':
      return {
        ...state,
        selected:[],
        selectProps: {
            isMultiple: false,
            withFolder: false,
            withFile: false,
            withExtra: false
        },
        keywords: '',
      }
    default:
      return state
  }
}

export default explorer