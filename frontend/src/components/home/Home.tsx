import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [gameData, setGameData] = useState<any>(null);
  const [time, setTime] = useState<string>("00:00");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/data");
        const data = await response.json();
        setGameData(data);
        if (data?.map?.clock_time !== undefined) {
          setTime(formatTime(data.map.clock_time));
        }
      } catch (error) {
        console.error("Veri alınırken hata oluştu:", error);
      }
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    } else {
      return `${mins}:${String(secs).padStart(2, "0")}`;
    }
  };

  if (!gameData || !gameData.player) {
    return <p>Veri bekleniyor...</p>;
  }

  const players = Object.values(gameData.player);
  const heroes = Object.values(gameData.hero);
  const radiantHeros = Object.values(heroes[0] || {}).slice(0, 5);
  const direHeros = Object.values(heroes[1] || {}).slice(0, 5);
  const radiantPlayers = Object.values(players[0] || {}).slice(0, 5);
  const direPlayers = Object.values(players[1] || {}).slice(0, 5);
  const radiantScore = gameData.map?.radiant_score ?? 0;
  const direScore = gameData.map?.dire_score ?? 0;


  // console.log(gameData);
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Canlı Oyun</h1>
      {/* Oyun Zamanı */}
      <p className="text-lg font-semibold">Oyun Süresi: {time}</p>

      {/* Radiant Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-green-500">
          Radiant ({radiantScore})
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-200">
              <th className="border p-2">Oyuncu</th>
              <th className="border p-2">Hero</th>
              <th className="border p-2">K/D/A</th>
              <th className="border p-2">LH/D</th>
              <th className="border p-2">NW</th>
              <th className="border p-2">Account ID</th>
              <th className="border p-2">Steam ID</th>
            </tr>
          </thead>
          <tbody>
            {radiantPlayers.map((player: any, index: number) => (
              <tr key={index} className="border">
                <td className="border p-2">{player.name}</td>
                <td className="border p-2">
                  {radiantHeros[index]?.name
                    .replace("npc_dota_hero_", "")
                    .replace(/\b\w/g, (char:any) => char.toUpperCase()) || "Bilinmiyor"}
                </td>
                <td className="border p-2">{player.kills}/{player.deaths}/{player.assists}</td>
                <td className="border p-2">{player.last_hits}/{player.denies}</td>
                <td className="border p-2">{player.net_worth}</td>
                <td className="border p-2">{player.accountid}</td>
                <td className="border p-2">{player.steamid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dire Tablosu */}
      <div>
        <h2 className="text-lg font-semibold text-red-500">
          Dire ({direScore})
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-red-200">
              <th className="border p-2">Oyuncu</th>
              <th className="border p-2">Hero</th>
              <th className="border p-2">K/D/A</th>
              <th className="border p-2">LH/D</th>
              <th className="border p-2">NW</th>
              <th className="border p-2">Account ID</th>
              <th className="border p-2">Steam ID</th>
            </tr>
          </thead>
          <tbody>
            {direPlayers.map((player: any, index: number) => (
              <tr key={index} className="border">
                <td className="border p-2">{player.name}</td>
                <td className="border p-2">{direHeros[index]?.name.replace("npc_dota_hero_", "").replace(/\b\w/g, (char: any) => char.toUpperCase()) || "Bilinmiyor"}</td>
                <td className="border p-2">{player.kills}/{player.deaths}/{player.assists}</td>
                <td className="border p-2">{player.last_hits}/{player.denies}</td>
                <td className="border p-2">{player.net_worth}</td>
                <td className="border p-2">{player.accountid}</td>
                <td className="border p-2">{player.steamid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
