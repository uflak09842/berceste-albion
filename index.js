const { Client, Collection, Events, GatewayIntentBits, PermissionFlagsBits, ActivityType } = require('discord.js');
const { allowedGuildId, token, statChId, sunucuId, kurucuId} = require('./config.json');
const { KlanEmbed } = require('./embeds.js'); 
const { GetGuildData } = require('./functions.js');

const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, async readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	const guilds = client.guilds.cache;

	for (const guild of guilds.values()) {
		if (!allowedGuildId.includes(guild.id)) {
			console.log(`İzin verilmeyen sunucuya katıldı: ${guild.name} (ID: ${guild.id}). Sunucudan çıkılıyor.`);
			
			guild.leave()
				.then(() => {
					console.log(`Sunucudan başarıyla ayrıldı: ${guild.name}`);
				})
				.catch(console.error);
		} else {
			console.log(`Bot izin verilen sunucuya katıldı: ${guild.name}`);
		}
	}

	client.user.setPresence({
		activities: [{ name: `Albion`, type: ActivityType.Playing }],
		status: 'online',
	});

	const { res, KillFame, DeathFame, kills, fame, deaths, ratio } = await GetGuildData();
	const guild = await client.guilds.fetch(sunucuId);
	const member = await guild.members.fetch(kurucuId);
	const ownerAvatar = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

	const channel = client.channels.cache.get(statChId);
	if(!channel) {
		console.log('Belirtilen Kanal Bulunamadı \nindex.js client.once client ready event');
		return;
	};

	let sentMessage = await channel.send({ embeds: [await KlanEmbed(res, KillFame, DeathFame, kills, fame, deaths, ratio, ownerAvatar)]});

	setInterval(async () => {
		const updatedEmbed = await KlanEmbed(res, KillFame, DeathFame, kills, fame, deaths, ratio, ownerAvatar);

		try {
			await sentMessage.edit({ embeds: [updatedEmbed]});
		} catch (e) {
			console.error(e);
		}
	}, 60000);
});

client.on('guildCreate', (guild) => {
    if (!allowedGuildId.includes(guild.id)) {
        console.log(`İzin verilmeyen sunucuya katıldı: ${guild.name} (ID: ${guild.id}). Sunucudan çıkılıyor.`);
        
        guild.leave()
            .then(() => {
                console.log(`Sunucudan başarıyla ayrıldı: ${guild.name}`);
            })
            .catch(console.error);
    } else {
        console.log(`Bot izin verilen sunucuya katıldı: ${guild.name}`);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Komut kullanılırken bir hata oluştu!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Komut kullanılırken bir hata oluştu!', ephemeral: true });
		}
	}
});

client.login(token);