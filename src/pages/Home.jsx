import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSurah, setSearchTerm, toggleDarkMode } from '../features/quranSlice';
import { Link } from 'react-router-dom';
import { SkeletonCard } from '../components/Skeleton';

const Home = () => {
  const pinnedIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#FFF0BE">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );
  const sunIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
  const moonIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z" />
    </svg>
  );
  const bookmarkIconFilled = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
  const heatsparkleIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#FFF0BE">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M18 12h1M3 12h1m-.707-.707l.707-.707M16.95 6.343l-.707-.707M19.071 12.45a8 8 0 11-16.142 0 8 8 0 0116.142 0z" />
    </svg>
  );

  const dispatch = useDispatch();
  const { surahList, loading, searchTerm, lastRead, darkMode } = useSelector((state) => state.quran);
  const [greeting, setGreeting] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    dispatch(getAllSurah());
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 15) setGreeting('Good Afternoon');
    else if (hour < 18) setGreeting('Good Evening');
    else setGreeting('Good Night');

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  const getSurahArray = () => {
    if (Array.isArray(surahList)) return surahList;
    if (surahList && Array.isArray(surahList.data)) return surahList.data;
    if (surahList && typeof surahList === 'object') {
      const potentialArray = Object.values(surahList).find(val => Array.isArray(val));
      if (potentialArray) return potentialArray;
    }
    return [];
  };

  const surahArray = getSurahArray();

  const filteredSurah = surahArray.filter((s) =>
    s?.namaLatin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s?.nama_latin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen transition-all duration-500 bg-slate-50/50 dark:bg-[#0f172a] pb-20">
      <nav className={`fixed top-0 left-0 right-0 z-[100] px-4 md:px-10 py-4 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-slate-200 dark:border-slate-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-white font-black text-xl italic">Q</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
              Qude<span className="text-amber-500">X</span>
            </h1>
          </div>
          
          <div className="flex gap-3">
            <Link to="/bookmark" className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white hover:rotate-1 hover:scale-110 transition-all shadow-sm">
              <span className="text-lg flex items-center">{bookmarkIconFilled}</span>
              <span className="hidden sm:inline">Bookmarks</span>
            </Link>
            <button 
              onClick={() => dispatch(toggleDarkMode())}
              className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-amber-500 hover:text-white transition-transform hover:rotate-2 hover:scale-110 active:scale-90"
            >
              {darkMode ? sunIcon : moonIcon}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-10 max-w-7xl pt-28">
        <section className="relative rounded-[3.5rem] p-10 md:p-20 mb-16 overflow-hidden shadow-4xl shadow-amber-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 animate-gradient-x"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border border-white/30">
                <span className="animate-pulse flex items-center">{heatsparkleIcon}</span> {greeting}
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none italic">
                Modern Age <br /> <span className="text-amber-300">X</span> The Holy Quran.
              </h2>
              <p className="text-amber-50/90 text-lg md:text-xl mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                "Verily, in the remembrance of Allah do hearts find rest."
              </p>
            </div>

            {lastRead && (
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 md:p-10 rounded-[3rem] shadow-2xl transition-all hover:bg-white/15 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                     <p className="text-amber-200 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Last Read Position</p>
                     <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                      {lastRead.surah} <br/>
                      <span className="text-xl opacity-80 font-bold italic">Verse {lastRead.ayat}</span>
                     </h3>
                  </div>
                  <div className="w-14 h-14 bg-amber-400/30 rounded-3xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">{pinnedIcon}</div>
                </div>
                <Link 
                  to={`/surat/${lastRead.nomor}`} 
                  className="group inline-flex items-center gap-3 bg-amber-50 text-amber-600 px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl"
                >
                  Resume Reading <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        <div className="max-w-3xl mx-auto -mt-24 relative z-50 px-4 mb-20">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search surah..."
              className="w-full p-8 pl-24 bg-white dark:bg-slate-800 border-none rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(245,158,11,0.3)] dark:shadow-none focus:ring-4 focus:ring-amber-500/20 transition-all outline-none dark:text-white text-xl font-bold placeholder:text-slate-300"
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg flex items-center justify-center text-white">
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [...Array(9)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filteredSurah.map((surah) => (
              <Link 
                to={`/surat/${surah.nomor || surah.number}`} 
                key={surah.nomor || surah.number} 
                className="group flex"
              >
                <div className="w-full p-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-[3rem] hover:shadow-[0_40px_80px_-20px_rgba(245,158,11,0.25)] dark:hover:shadow-none transition-all duration-500 group-hover:-translate-y-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/5 rounded-full group-hover:scale-[4] transition-transform duration-1000"></div>
                  
                  <div className="flex justify-between items-center mb-12 relative z-10">
                    <div className="w-14 h-14 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center rounded-2xl font-black text-lg group-hover:rotate-12 transition-transform duration-300">
                      {surah.nomor || surah.number}
                    </div>
                    <h3 className="text-4xl font-bold text-amber-700 dark:text-amber-500 font-arabic opacity-80">
                      {surah.nama || surah.name}
                    </h3>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight group-hover:text-amber-600 transition-colors">
                      {surah.namaLatin || surah.nama_latin}
                    </h3>
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">{surah.arti || surah.meaning}</p>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em]">{surah.jumlahAyat || surah.numberOfVerses || surah.jumlah_ayat} Verses</p>
                    </div>
                  </div>

                  <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                     <span className="text-amber-500 text-2xl font-black">→</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {!loading && filteredSurah.length === 0 && (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-400 text-2xl font-black tracking-tight">Oops! Surah not found.</p>
            <p className="text-slate-300">Try searching with a different name.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;