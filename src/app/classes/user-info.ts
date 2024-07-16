export class UserInfo {
    username: string;
    password: string;
    email: string | null;
    pseudo: string | null;
    highscore: string | null;
    latestscore: string | null;
    gamesplayed: string | null;

    constructor(username: string, password: string, email: string | null = null, pseudo: string | null = null, highscore: string | null = null, latestscore: string | null = null, gamesplayed: string | null = null) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.pseudo = pseudo;
        this.highscore = highscore;
        this.latestscore = latestscore;
        this.gamesplayed = gamesplayed;
    }

    get getUsername(): string {
        return this.username;
    }

    get getPassword(): string {
        return this.password;
    }

    get getEmail(): string | null {
        return this.email;
    }

    get getPseudo(): string | null {
        return this.pseudo;
    }

    get getHighscore(): string | null {
        return this.highscore;
    }

    get getLatestscore(): string | null {
        return this.latestscore;
    }

    get getGamesplayed(): string | null {
        return this.gamesplayed;
    }

    set setUsername(username: string) {
        this.username = username;
    }

    set setPassword(password: string) {
        this.password = password;
    }

    set setEmail(email: string | null) {
        this.email = email;
    }

    set setPseudo(pseudo: string | null) {
        this.pseudo = pseudo;
    }

    set setHighscore(highscore: string | null) {
        this.highscore = highscore;
    }

    set setLatestscore(latestscore: string | null) {
        this.latestscore = latestscore;
    }

    set setGamesplayed(gamesplayed: string | null) {
        this.gamesplayed = gamesplayed;
    }

    get getUserInfo(): UserInfo {
        return this;
    }

    set setUserInfo(userInfo: UserInfo) {
        this.username = userInfo.username;
        this.password = userInfo.password;
        this.email = userInfo.email;
        this.pseudo = userInfo.pseudo;
        this.highscore = userInfo.highscore;
        this.latestscore = userInfo.latestscore;
        this.gamesplayed = userInfo.gamesplayed;
    }
}
