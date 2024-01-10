"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodeList = $("#episodesList");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm( term ) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
   const res = await axios.get('http://api.tvmaze.com/search/shows',{params:{q:term}});
  console.log(res.data)
  const movies = res.data;
  return movies.map(movie => {
    const detail = movie.show
    return{
      'id': detail.id,
      'image': detail.image? detail.image.medium : 'https://tinyurl.com/tv-missing',
      'summary': detail.summary,
      'name':detail.name
    };
  });
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
      for (let show of shows) {
        const $show = $(
          `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
             <div class="media">
               <img
                  src="${show.image}";
                  alt="${show.name}"
                  class="w-25 me-3">
               <div class="media-body">
                 <h5 class="text-primary">${show.name}</h5>
                 <div><small>${show.summary}</small></div>
                 <button class="btn btn-outline-light btn-sm Show-getEpisodes">
                   Episodes
                 </button>
               </div>
             </div>
           </div>
          `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  // console.log(res);
  const episodes = res.data;
  console.log(episodes);
  return episodes.map(episode => {
    return{
      'id':episode.id,
      'name':episode.name,
      'season':episode.season,
      'number':episode.number
    }
  })

 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $episodeList.empty();
  for(let episode of episodes){
    const text = `${episode.name} (season ${episode.season}, number ${episode.number})`;
    $episodeList.append(`<li>${text})</li>`);
  }
  // jQuery.fx.off = true; // how to turn off .hide()?
  $episodesArea.show();
}

$showsList.on('click','.Show-getEpisodes',async function(e){
  e.preventDefault;
  const $showId =$(e.target).closest('.Show').data('show-id');
  console.log($showId);
  const episodes = await getEpisodesOfShow($showId);
  populateEpisodes(episodes);
})




