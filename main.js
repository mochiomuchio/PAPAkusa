document.addEventListener('DOMContentLoaded', () => {

    // --- ローディング画面の処理 ---
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000); // 最低1秒は表示する（かわいい演出のため）

    // --- 背景に降ってくるいちごエフェクト ---
    const bgEffects = document.getElementById('bg-effects');
    const emojis = ['🍓', '🌸', '✨', '🍓'];
    const maxItems = 15;

    for (let i = 0; i < maxItems; i++) {
        createFloatingItem();
    }

    function createFloatingItem() {
        const el = document.createElement('div');
        el.className = 'floating-item';
        el.innerText = emojis[Math.floor(Math.random() * emojis.length)];

        // ランダムな位置とサイズ、アニメーション速度
        const size = Math.random() * 2 + 1; // 1rem ~ 3rem
        const left = Math.random() * 100; // 0% ~ 100%
        const duration = Math.random() * 10 + 10; // 10s ~ 20s
        const delay = Math.random() * 10; // 0s ~ 10s

        el.style.fontSize = `${size}rem`;
        el.style.left = `${left}vw`;
        el.style.animationDuration = `${duration}s`;
        el.style.animationDelay = `-${delay}s`; // 最初から画面内にばらけさせる

        bgEffects.appendChild(el);
    }

    // --- ナビゲーションバーのスクロールエフェクト ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '5px 20px';
            navbar.style.boxShadow = '0 4px 20px rgba(255, 77, 109, 0.15)';
        } else {
            navbar.style.padding = '10px 20px';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // --- お問い合わせフォーム送信（Web3Forms） ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerText;
            submitButton.innerText = '送信中...';
            submitButton.disabled = true;

            const formData = new FormData(contactForm);
            
            // Web3FormsのAPIキーが設定されていない場合のエラーハンドリング
            if (formData.get('access_key') === 'YOUR_WEB3FORMS_ACCESS_KEY') {
                alert('【テストモード】\nまだ実際の受信用設定（Access Key）が行われていないため、送信テストのみを実行しました！');
                submitButton.innerText = originalButtonText;
                submitButton.disabled = false;
                contactForm.reset();
                return;
            }

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('メッセージを送信しました！応援ありがとう！🍓');
                    contactForm.reset();
                } else {
                    alert('送信に失敗しました。もう一度お試しください。');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('通信エラーが発生しました。インターネット接続を確認してください。');
            } finally {
                submitButton.innerText = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // --- YouTube API 連携（モック/プレースホルダー） ---
    // [!IMPORTANT]
    // 実際にAPIを使用する場合は、以下の YOUR_API_KEY と CHANNEL_ID を書き換えてください。
    const YOUR_API_KEY = 'AIzaSyD2HEO9yr3WUsO_8yUT4nO6_b51E182vT0';
    const CHANNEL_ID = 'UCFalsP3tPjI9mQ_DLzxHbEg'; // またはぱぱくさゲームズのチャンネルID
    const MAX_RESULTS = 3;

    const videoContainer = document.getElementById('video-container');

    // 実際のAPIリクエスト関数（キーがない場合はモックデータを表示します）
    async function fetchYouTubeVideos() {
        if (YOUR_API_KEY === 'YOUR_API_KEY') {
            // APIキーが設定されていない場合はモックデータを表示（デザイン確認用）
            renderMockVideos();
            return;
        }

        try {
            // チャンネルのアップロードプレイリストIDを取得するなどの処理が必要ですが、
            // ここではシンプルにチャンネルの最新動画を検索する形にします。
            const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUR_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}&type=video`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            videoContainer.innerHTML = ''; // ローディング表記を消す

            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const thumbnailUrl = item.snippet.thumbnails.high.url;

                const videoHtml = `
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer" class="video-card">
                        <img src="${thumbnailUrl}" alt="${title}" class="video-thumb">
                        <div class="video-info">
                            <h4 class="video-title">${title}</h4>
                            <div class="video-stats">▶ YouTubeで見る</div>
                        </div>
                    </a>
                `;
                videoContainer.innerHTML += videoHtml;
            });

        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            videoContainer.innerHTML = '<p style="text-align:center;">動画の読み込みに失敗しました😢<br>後でもう一度試してね！</p>';
        }
    }

    // モックデータ表示用関数（デザイン確認用）
    function renderMockVideos() {
        videoContainer.innerHTML = '';
        const mockVideos = [
            { id: '1', title: '【Roblox】絶対クリアできない超激ムズアスレチックに挑戦！【ぱぱくさゲームズ】', thumb: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
            { id: '2', title: 'みんなでワイワイ！かくれんぼで神回避連発！？【Roblox】', thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
            { id: '3', title: '【爆笑】面白すぎる神ゲー見つけたから紹介する！！', thumb: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }
        ];

        mockVideos.forEach(v => {
            const videoHtml = `
                <a href="https://www.youtube.com/@papakusa_games" target="_blank" rel="noopener noreferrer" class="video-card">
                    <img src="${v.thumb}" alt="${v.title}" class="video-thumb">
                    <div class="video-info">
                        <h4 class="video-title">${v.title}</h4>
                        <div class="video-stats">▶ YouTubeで見る (仮)</div>
                    </div>
                </a>
            `;
            videoContainer.innerHTML += videoHtml;
        });
    }

    // 動画取得を実行
    fetchYouTubeVideos();

});
