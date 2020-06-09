let vm = new Vue({
    el: '#app',
    data: {
        program_data: [],
        ytplay_flg: false,
        cur_video_id: "",
        themes: [],
        searched_program: [],
        sort_flg: 'd',  // ascending or decending
        book_json: book_json
    },
    methods: {
        playYT: function(video_id) {
            console.log(this.ytplay_flg)
            if (this.ytplay_flg === true && this.cur_video_id === video_id) {
                this.ytplay_flg = false;
            } else {
                this.ytplay_flg = true;
                this.cur_video_id = video_id;
                console.log(video_id);
                ytPlayer.cueVideoById(video_id.replace('/watch?v=', ''));
            }
            
        },
        closeYT: function() {
            ytPlayer.stopVideo();
            this.ytplay_flg = false;
        },
        episode_num: function(num){
            if (num.indexOf('ex.')) {
                return '#' + Number(num)
            } else {
                return '#ex.' + Number(num.substr(3)) 
            }
        },
        search_theme: function(p_no) {
            let temp = []
            console.log(p_no)
            if (p_no[0] === "ex") {
                this.searched_program = this.program_data.filter( function( value, index, array ) {
                    return value.num.indexOf('ex') >= 0;       
                })
            } else {
                this.searched_program = this.program_data.filter( function( value, index, array ) {
                    return p_no.indexOf(value.num) >= 0;       
                })
            }
            
            this.sort_flg = 'a'
            this.sort_program(this.sort_flg)
            $('#myModal').modal('hide');
        },
        display_all: function(p_no) {
            this.searched_program = this.program_data
            this.sort_program(this.sort_flg)
        },
        sort_program: function() {
            this.searched_program.sort(function(a,b){
                if( a.delivery_date < b.delivery_date ) {
                    return -1;
                } else if( a.delivery_date > b.delivery_date ) {
                    return 1;
                } else {
                    if (a.num < b.num) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
            if (this.sort_flg === 'd') {
                this.searched_program = this.searched_program.reverse();
            }
        },
        sort_change: function() {
            if (this.sort_flg === 'd') {
                this.sort_flg = 'a';
            } else {
                this.sort_flg = 'd';
            }
            this.sort_program(this.sort_flg);
        }
    },
    computed: {

    },
    created: function () {
        this.program_data = program_json
        this.searched_program = program_json
        this.display_all(this.sort_flg)
        this.themes = theme_json
        let l = this.themes.length;
         dx = 3 - l%3;
        for (i=0; i<dx; i++) {
            this.themes.push([])
        }
    }
})


// YouTube Player APIを読み込む
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let ytPlayer;
// API読み込み後にプレーヤー埋め込み
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('ytarea', {
        width: 250,
        height: 190,
        videoId: ''
    });
}