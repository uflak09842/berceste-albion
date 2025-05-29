const fs = require('fs');
const { marketAmerikaServer, marketAsyaServer, marketAvrupaServer} = require('./config.json');

async function GetGuildData() {
    try {
        const response = await fetch('https://gameinfo-ams.albiononline.com/api/gameinfo/guilds/nD_p9uTdSEO84aenQIsgmg/data')
        const res = await response.json();

        const KillFame = res.guild.killFame.toLocaleString('tr-TR');
        const DeathFame = res.guild.DeathFame.toLocaleString('tr-TR');
        const kills = res.overall.kills.toLocaleString('tr-TR');
        const fame = res.overall.fame.toLocaleString('tr-TR');
        const deaths = res.overall.deaths.toLocaleString('tr-TR');
        const ratio = res.overall.ratio;

        return {
            res,
            KillFame,
            DeathFame,
            kills,
            fame,
            deaths,
            ratio,
        };
    } catch(e) {
        console.log(e);
    };
};

async function GetPlayerData(Id) {
    try {
        const response = await fetch(`https://gameinfo-ams.albiononline.com/api/gameinfo/players/${Id}`)
        const playerRes = await response.json();

        return {
            playerRes,
        }
    } catch(e) {
        console.log(e);
    }
};

function getDataFromFile() {
    const data = fs.readFileSync('./gdcids.json', 'utf-8');
    return JSON.parse(data);
};

function GetDiscordIdByGameId(gameId) {
    const data = getDataFromFile();

    const entry = data.find(item => item.gameId === gameId);
    return entry ? entry.discordId : null;
};

async function GetGoldData(server) {
    const marketUrls = {
        Amerika: `${marketAmerikaServer}/api/v2/stats/gold?count=1`,
        Asya: `${marketAsyaServer}/api/v2/stats/gold?count=1`,
        Avrupa: `${marketAvrupaServer}/api/v2/stats/gold?count=1`
    };

    const url = marketUrls[server];

    if(!url) {
        console.log('Geçersiz sunucu ismi');
        return;
    };

    try {
        const response = await fetch(url);
        const res = await response.json();
        
        return {
            res
        };
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    GetGuildData,
    GetPlayerData,
    GetDiscordIdByGameId,
    GetGoldData
}