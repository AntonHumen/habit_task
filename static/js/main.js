const listEl = document.getElementById('list')
const form = document.getElementById('add-form')
const themeBtn = document.getElementById('theme-toggle')
// Light/Dark toggle
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark')
    themeBtn.textContent = document.body.classList.contains('dark') ? "☀️ Light" : "🌙 Dark"
})
async function fetchHabits(){
    const res = await fetch('/habits/')
    const data = await res.json()
    render(data)
}
function render(habits){
    listEl.innerHTML = ''
    for(const h of habits){
        const li = document.createElement('li')
        li.className = h.completed ? 'completed' : ''
        const name = document.createElement('span')
        name.textContent = h.name
        const completeBtn = document.createElement('button')
        completeBtn.textContent = 'Complete'
        completeBtn.disabled = h.completed
        completeBtn.onclick = async ()=>{
            await fetch(`/habits/${h.id}/complete`, {method:'PUT'})
            await fetchHabits()
        }
        const delBtn = document.createElement('button')
        delBtn.textContent = 'Delete'
        delBtn.onclick = async ()=>{
            await fetch(`/habits/${h.id}`, {method:'DELETE'})
            await fetchHabits()
        }
        li.appendChild(name)
        li.appendChild(completeBtn)
        li.appendChild(delBtn)
        listEl.appendChild(li)
    }
}
form.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const name = document.getElementById('name').value.trim()
    if(!name) return
    await fetch('/habits/', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({name})
    })
    document.getElementById('name').value = ''
    await fetchHabits()
})
// initial load
fetchHabits()