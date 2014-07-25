---
interpolate: true
---

function getCorrectUrl(linkUrl) {
  if (linkUrl.indexOf("/") > 0) {
    return linkUrl;
  } else {
    return "https://jboss.org" + linkUrl;
  }
}

function jbossLink(linkUrl) {
  if (linkUrl.indexOf("jboss.org") > 0) {
    return true;
  } else {
    return false;
  }
}

app.project = {
  projectFilter : function(filters, keyword, container, thumbnailSize) {
    // Get the Filter Items

    //Currently the only way to specify no limit
    var maxResults = 500;

    /*
      Keyword
    */
    var keyword = keyword || $('input[name="filter-text"]').val();

    var filters = $.extend(filters, {"keyword": keyword});
    var currentFilters = {};

    if ($('select[name="filter-products"]').length && $('select[name="filter-products"]').val() !== "") {
      filters['project'] = app.products[$('select[name="filter-products"]').val()]['upstream'];
    }

    $.each(filters, function(key, val) {
      // if its empty, remove it from the filters
      if(val != undefined && val.length) {
        currentFilters[key] = val;
      }
    });

    // Prep each filter
    var query = ['NOT archived:true'];

    if(currentFilters['keyword']) {
      query.push(keyword);
      delete currentFilters['keyword']
    }

    var query = query.join(" AND ");

    // append loading class to wrapper
    $("ul.results").addClass('loading');
    var request_data = {
        "sys_type" : "project_info",
        "field"  : ["_source"],
        "query" : query,
        "size" : maxResults
    } 
    $.extend(request_data, currentFilters);

    $.ajax({
      url : app.dcp.url.search,
      dataType: 'json',
      data : request_data,
      container : container,
      thumbnailSize : thumbnailSize,
      error : function() {
        $('ul.results').html(app.dcp.error_message);
      }
    }).done(function(data){
      var container = this.container || $('ul.results');
      var thumbnailSize = this.thumbnailSize || "200x150";
      app.project.format(data, container, thumbnailSize);
    });
  },
  clearFilters: function($el) {
      var form = $('form.project-filters');
      form[0].reset();
      this.projectFilter();
  },
  fallbackImage: function(el) {
    var src = "#{cdn( site.base_url + '/images/design/projects/default_200x150.png')}";
    el.src = src;
  },
  format : function(data, container, thumbnailSize) {
    var hits = data.hits.hits; // first one for testing
    hits.sortJsonArrayByProperty("_source.sys_title");
    var html = "";
    // loop over every hit

    for (var i = 0; i < hits.length; i++) {
      var props = hits[i]._source;
      
      var imgsrc = "http://static.jboss.org/" + (props.specialIcon || props.sys_project) + "/images/" + (props.specialIcon || props.sys_project) + "_" + thumbnailSize + ".png";

      var template = "<li class=\"upstream\">"
        + "<div class=\"defaultprojectimage\">"
        + "<a class=\"image-link\" href=\""
        + getCorrectUrl(props.sys_url_view)
        + "\"><img onerror=\"app.project.fallbackImage(this)\" src='" + imgsrc + "'></a></div>"
        + "<h3 class=\"solution-name\"><a class=\"solution-name-link\" href=\""
        + getCorrectUrl(props.sys_url_view) + "\">"
        + props.projectName + "</a></h3><p></p>";

      if (props.downloadsLink) {
        template += "<a class=\"upstream-download\" href=\""
          + getCorrectUrl(props.downloadsLink) + "\"><i class=\"fa fa-download\"></i> Download</a>";
      }
      template += "<div class=\"upstream-more-content\">"
        // + "<p class=\"product-links\">Included in Product(s)<br></p>"
        + "<ul>";

      if (props.docsLink) {
        var correctLink = getCorrectUrl(props.docsLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Documentation</a></li>";
      }
      if (props.communityLink) {
        var correctLink = getCorrectUrl(props.communityLink)
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Community</a></li>";
      }
      if (props.knowledgeBaseLink) {
        var correctLink = getCorrectUrl(props.knowledgeBaseLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">KnowledgeBase</a></li>";
      }
      if (props.userForumLink) {
        var correctLink = getCorrectUrl(props.userForumLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">User Forum</a></li>";
      }
      if (props.devForumLink) {
        var correctLink = getCorrectUrl(props.devForumLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Dev Forum</a></li>";
      }
      if (props.mailingListLink) {
        var correctLink = getCorrectUrl(props.mailingListLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Mailing List</a></li>";
      }
      if (props.chatLink) {
        var correctLink = getCorrectUrl(props.chatLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Chat</a></li>";
      }
      if (props.blogLink) {
        var correctLink = getCorrectUrl(props.blogLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Blog</a></li>";
      }
      if (props.twitterLink) {
        var correctLink = getCorrectUrl(props.twitterLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Twitter</a></li>";
      }
      if (props.issueTrackerLink) {
        var correctLink = getCorrectUrl(props.issueTrackerLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Issue Tracker</a></li>";
      }
      if (props.jiraLink) {
        var correctLink = getCorrectUrl(props.jiraLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">JIRA</a></li>";
      }
      if (props.srcLink) {
        var correctLink = getCorrectUrl(props.srcLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Source</a></li>";
      }
      if (props.anonymousLink) {
        var correctLink = getCorrectUrl(props.anonymousLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Anonymous Source</a></li>";
      }
      if (props.commiterLink) {
        var correctLink = getCorrectUrl(props.commiterLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Committer Source Access</a></li>";
      }
      if (props.fisheyeLink) {
        var correctLink = getCorrectUrl(props.fisheyeLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">FishEye</a></li>";
      }
      if (props.viewvcLink) {
        var correctLink = getCorrectUrl(props.viewvcLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">View Source</a></li>";
      }
      if (props.githubLink) {
        var correctLink = getCorrectUrl(props.githubLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Github</a></li>";
      }
      if (props.anonymousGitLink) {
        var correctLink = getCorrectUrl(props.anonymousGitLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Anonymous Git</a></li>";
      }
      if (props.committerGitLink) {
        var correctLink = getCorrectUrl(props.committerGitLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Committer Git</a></li>";
      }
      if (props.buildLink) {
        var correctLink = getCorrectUrl(props.buildLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Build</a></li>";
      }
      if (props.hudsonLink) {
        var correctLink = getCorrectUrl(props.hudsonLink);
        template += "<li><a href=\"" + correctLink + "\"";
        if (!jbossLink(correctLink)) {
          template += " class=\"external-link\"";
        }
        template += ">Jenkins</a></li>";
      }

      template += "</ul></div><a class=\"upstream-toggle-more\" href=\"#\"><span class=\"view-more\">View More <i class=\"fa fa-plus-square\"></i></span><span class=\"view-less\">View Less <i class=\"fa fa-minus-square\"></i></span></a></li>";
      // Append template to HTML
      html += template;
    }

    // Inject HTML into the DO<
    if(!html) {
      html = "Sorry, no results to display. Please modify your search.";
    }
    container.html(html).removeClass('loading');
    $("#results-label").html(hits.length);

  }
}

// Event Listeners
$(function() {

  var timeOut;
  $('form.project-filters').on('keyup','input',function(e){
    clearTimeout(timeOut);
    var el = $(this);
    timeOut = setTimeout(function() {
      app.project.projectFilter();
      app.utils.updatePageHash(el);
    }, 300);
  });

  $('form.project-filters').on('submit',function(e) {
    e.preventDefault();
  });

  $('select[name="filter-products"]').on('change', function(e) {
    e.preventDefault();
    var el = $(this);
    app.project.projectFilter(); 
    app.utils.updatePageHash(el);
  });

  $('.project-filters-clear').on('click',function(e){
    e.preventDefault();
    app.project.clearFilters($(this));
  });

  if ($('.project-filters').length) {
    if (window.location.search) {
      var product_id = app.getQueryVariable('included-in');
      $('option[value="'+product_id+'"]').attr('selected','selected');
      app.project.projectFilter({project: app.products[product_id]['upstream']});
    } else {
      app.project.projectFilter();
    }
  }
  if ($('.community-projects').length) {
    app.project.projectFilter({project: app.products[$('.community-projects').data('product-id')]['upstream']});
  }

  /*
     Upstream Solutions View More Link
   */
  $('ul.results, ul.featured-projects-results').on('click','.upstream-toggle-more',function(e){
    e.preventDefault();
    var el = $(this);

    el.toggleClass('upstream-toggle-open');
    el.prev('.upstream-more-content').slideToggle();
  });

  /*
    Featured Projects
  */

  var featuredProjectIds = $('.featured-project-ids');

  if(featuredProjectIds.length) {
    var queryVal = JSON.parse(featuredProjectIds.text()).join(' OR ');
    var query = "sys_content_id:("+queryVal+")";
    
    app.project.projectFilter(null, query, $('ul.featured-projects-results'), '500x400');
  }

});

