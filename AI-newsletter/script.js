document.addEventListener('DOMContentLoaded', () => {
  fetch('./data/mdb.json')
    .then(res => res.json())
    .then(data => {
      const { users, posts } = data;

      // 유저 테이블 채우기
      const userTbody = document.querySelector('#userTable tbody');
      users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${u.id}</td><td>${u.username}</td><td>${u.joinedAt}</td>`;
        userTbody.appendChild(tr);
      });

      // 포스트 카드 생성
      const postCards = document.getElementById('postCards');
      posts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
          <h3>${p.title}</h3>
          <p><small>${p.date} • 작성자 ID ${p.userId}</small></p>
          <img src="${p.url}" alt="${p.title}" />
          <p>${p.introduction}</p>
          <button class="show-content">내용 보기</button>
          <div class="full-content" style="display:none">
            <p>${p.content}</p>
            <h4>댓글</h4>
            ${p.comments.map(c =>
              `<div class="comment">
                 <p><strong>${c.username}</strong> (${c.createdAt})</p>
                 <p>${c.content}</p>
               </div>`
            ).join('')}
          </div>
        `;
        postCards.appendChild(card);

        // "내용 보기" 토글
        card.querySelector('.show-content')
            .addEventListener('click', e => {
              const fc = card.querySelector('.full-content');
              fc.style.display = fc.style.display === 'none' ? 'block' : 'none';
            });
      });

      // 포스트 수 차트 데이터 준비
      const countByUser = users.map(u =>
        posts.filter(p => p.userId == u.id).length
      );
      const ctx = document.getElementById('postsChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: users.map(u => u.username),
          datasets: [{
            label: '포스트 개수',
            data: countByUser
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    })
    .catch(err => {
      console.error('mdb.json 로드 실패', err);
      document.querySelector('.main_content')
        .insertAdjacentHTML('beforeend','<p>데이터 불러오기에 실패했습니다.</p>');
    });
});
