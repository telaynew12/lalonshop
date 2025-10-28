
const toggleModal = (parentId, childId, e) => {
    const parent = document.getElementById(parentId)
    const child = document.getElementById(childId)
    if (e === 'open') {
        parent.classList.remove('hidden')
        child.classList.remove('scale-90')
        child.classList.remove('opacity-0')
        child.classList.remove('invisible')
        child.classList.add('scale-100')
        child.classList.add('visible')
        child.classList.add('opacity-100')
    }
    else {
        parent.classList.add('hidden')
        child.classList.add('scale-90')
        child.classList.add('opacity-0')
        child.classList.add('invisible')
        child.classList.remove('visible')
        child.classList.remove('scale-100')
        child.classList.remove('opacity-100')
    }
};

export default toggleModal;