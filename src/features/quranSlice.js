import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllSurah, fetchDetailSurah } from '../services/quranApi';

export const getAllSurah = createAsyncThunk('quran/getAllSurah', async () => {
  const response = await fetchAllSurah();
  return response.data.data;
});

export const getSurahDetail = createAsyncThunk('quran/getDetail', async (nomor) => {
  const response = await fetchDetailSurah(nomor);
  return response.data.data;
});

const initialState = {
  surahList: [],
  detailSurah: null,
  loading: false,
  error: null,
  searchTerm: '',
  bookmarks: JSON.parse(localStorage.getItem('qudex_bookmarks')) || [],
  lastRead: JSON.parse(localStorage.getItem('qudex_lastread')) || null,
  darkMode: JSON.parse(localStorage.getItem('qudex_dark')) || false,
};

const quranSlice = createSlice({
  name: 'quran',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    toggleBookmark: (state, action) => {
      const index = state.bookmarks.findIndex(b => b.id === action.payload.id);
      if (index >= 0) {
        state.bookmarks.splice(index, 1);
      } else {
        state.bookmarks.push(action.payload);
      }
      localStorage.setItem('qudex_bookmarks', JSON.stringify(state.bookmarks));
    },
    setLastRead: (state, action) => {
      state.lastRead = action.payload;
      localStorage.setItem('qudex_lastread', JSON.stringify(action.payload));
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('qudex_dark', JSON.stringify(state.darkMode));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSurah.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(getAllSurah.fulfilled, (state, action) => {
        state.loading = false;
        state.surahList = action.payload;
      })
      .addCase(getAllSurah.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getSurahDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSurahDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detailSurah = action.payload;
      })
      .addCase(getSurahDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, toggleBookmark, setLastRead, toggleDarkMode } = quranSlice.actions;
export default quranSlice.reducer;