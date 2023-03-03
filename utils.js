// dom utils
export const getByID = (id) => {
  return document.getElementById(id);
};

export const showLoader = () => {
  const el = getByID("loader")
  el.animate([
    {
      opacity: 0
    },
    {
      opacity: 1
    }
  ], {
    duration: 1000,
    fill: 'forwards'
  })

  el.style.opacity = 0;
  el.style.display = "grid";
};

export const hideLoader = () => {
  const el = getByID("loader")

  el.animate([
    {
      opacity: 1
    },
    {
      opacity: 0
    }
  ], {
    duration: 1000,
    fill: "forwards"
  })

  // el.style.display = "none";
  setTimeout(()=>{
    el.style.display = "none";
  }, 1100)
};
