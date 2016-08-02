export default class stcAdapter {
  constructor(options, config) {
    this.blockStart = options.blockStart || config.tpl.ld[0];
    this.blockEnd = options.blockStart || config.tpl.rd[0];

    this.options = options;
    this.config = config;
  }

  getLsSupportCode() {
    let { blockStart, blockEnd } = this;

    let nlsCookie = this.options.nlsCookie;

    let data = {};

    data['if'] = `${blockStart}if isset($smarty.server.HTTP_USER_AGENT) && strpos($smarty.server.HTTP_USER_AGENT, "MSIE ") === false && !isset($smarty.cookies.${nlsCookie})${blockEnd}`;
    data['else'] = `${blockStart}else${blockEnd}`;
    data['end'] = `${blockStart}/if${blockEnd}`;

    return data;
  }

  getLsConfigCode(appConfig) {
    let { blockStart, blockEnd } = this;
    
    let configStr = JSON.stringify(appConfig);

    return `${blockStart}$stc_ls_config=json_decode(\'${configStr}\', true)${blockEnd}`;
  }

  getLsBaseCode() {
    let { blockStart, blockEnd } = this;
    
    let name = 'stc_ls_base_flag';

    let data = {};

    data['if'] = `${blockStart}if !isset($${name})${blockEnd}${blockStart}$${name}=true${blockEnd}`;
    data['end'] = `${blockStart}/if${blockEnd}`;

    return data;
  }

  getLsParseCookieCode() {
    let { blockStart, blockEnd } = this;

    let lsCookie = this.options.lsCookie;

    let content = [
      `${blockStart}if isset($smarty.cookies.${lsCookie})${blockEnd}`, 
      `${blockStart}$stc_ls_cookie=$smarty.cookies.${lsCookie}${blockEnd}`, 
      `${blockStart}else${blockEnd}`, 
      `${blockStart}$stc_ls_cookie=""${blockEnd}`, 
      `${blockStart}/if${blockEnd}`, 
      `${blockStart}$stc_cookie_length=strlen($stc_ls_cookie)${blockEnd}`, 
      `${blockStart}$stc_ls_cookies=[]${blockEnd}`, 
      `${blockStart}$index=0${blockEnd}`, 
      `${blockStart}while $index < $stc_cookie_length${blockEnd}`, 
      `${blockStart}$stc_ls_cookies[$stc_ls_cookie[$index]]=$stc_ls_cookie[$index+1]${blockEnd}`, 
      `${blockStart}$index=$index+2${blockEnd}`, 
      `${blockStart}/while${blockEnd}`,
    ];

    return content.join('');
  }

  getLsConditionCode(lsValue) {
    let { blockStart, blockEnd } = this;

    let data = {};

    data['if'] = `${blockStart}if isset($stc_ls_config["${lsValue}"]) && isset($stc_ls_cookies[$stc_ls_config["${lsValue}"]["key"]]) && $stc_ls_config["${lsValue}"]["version"] === $stc_ls_cookies[$stc_ls_config["${lsValue}"]["key"]]${blockEnd}`;
    data['else'] = `${blockStart}else${blockEnd}`;
    data['end'] = `${blockStart}/if${blockEnd}`;
    data['key'] = `${blockStart}$stc_ls_config["${lsValue}"]["key"]${blockEnd}`;
    data['version'] = `${blockStart}$stc_ls_config["${lsValue}"]["version"]${blockEnd}`;

    return data;
  }
};