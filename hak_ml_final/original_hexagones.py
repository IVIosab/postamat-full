# imports

import geopandas as gpd
import pandas as pd
import numpy as np

import json
import h3
import osmnx as ox
from shapely.geometry import Polygon
from shapely.geometry import Point


def get_lat_lon(geometry):
    """given a geometry object, this function returns its latitude and longitude
    Args:
        geometry: an object of a class that belongs to shapely.geometry: Polygon, Point, LineString...
    """
    lon = geometry.apply(lambda x: x.x if x.type == 'Point' else x.centroid.x)
    lat = geometry.apply(lambda x: x.y if x.type == 'Point' else x.centroid.y)
    return lat, lon


def create_hexagons(geoJson, resolution):
    """given the coordinates of a Polygon object (stored in geoJson), this function will return a list of strings
    where each string is a h3 string representing the center of a hexagone that spans part of the hexagone according to the
    h3 geospatial indexing with the given resolution 

    Args:
        geoJson: a geoJson object (or dictionary): containing the coordinates of a Polygone object 
        resolution: a value representing the size of the hexagones that will split the region represented by the geoJson

    Returns:
        list of h3 indices
    """
    hexagons = list(h3.polyfill(geoJson, resolution))
    return hexagons


def get_geoJson(geo):
    """This function converts a geometry object into a geoJson object (dictionary with the same name conventions are geoJson)
    that stores the object's coordinates according to a specific format. (usually used by created hexagones function)

    Args:
        geo: an object of either type shapely.geometry.Polygon, or shapely.geometry.Point
    Returns:
        _type_: _description_
    """

    geoJson = json.loads(gpd.GeoSeries(geo).to_json())
    geoJson = geoJson['features'][0]['geometry']
    geoJson = {'type':'Polygon','coordinates': [np.column_stack((np.array(geoJson['coordinates'][0])[:, 1],
                                                        np.array(geoJson['coordinates'][0])[:, 0])).tolist()]}
    return geoJson


def get_hexagones(city: str, wanted_regions: list[str], resolution: int, filter_tag: dict={'boundary':'administrative'}):
    
    # put the city argument in a list for compatibility 
    city = [city]
    # extract geometrical objects from OpenStreetMap annotated with the passed tag "filter_tag"
    geometries = ox.geometries_from_place(city, filter_tag).reset_index()
    # drop rows whose name column in nan
    geometries.dropna(subset=['name'])
    # filter the wanted regions
    geometries = geometries[geometries['name'].isin(wanted_regions)]
    
    # define the columns in returned dataframe
    reg_cols = ['h3', 'lat', 'lng']
    # define the dataframe to return
    hexagones = pd.DataFrame(data=[], columns=reg_cols)
    
    # iterate through the given regions
    for region in wanted_regions:
        # extract the geometry corresponding to the current region
        region_geometry = geometries[geometries['name'] == region]['geometry']
        # convert the geometry object to the geoJson
        region_geoJson = get_geoJson(region_geometry)
        # extract the hexagones that span the current region
        try:
            # this function will return the h3index in form of a string for the given geoJson
            cells = create_hexagons(region_geoJson, resolution)
            # for each cell (h3index) extract the latitude and longitude
            # stored them in a dataframe to later concatenate it
            region_data = [[cell, h3.h3_to_geo(cell)[0], h3.h3_to_geo(cell)[1]] for cell in cells]
            region_data = pd.DataFrame(data=region_data, columns=reg_cols)
            hexagones = pd.concat([hexagones, region_data], ignore_index=True)
            i += 1
        except:
            # the function get_getJson expects a Polygon object. 
            # certain areas might be repressented as MultiPolygon
            # this block addresses such areas
            try:
                for po in region_geometry:
                    for p in po.geoms:
                        geoJson = get_geoJson(p)
                        cells = create_hexagons(geoJson, resolution)
                        region_data = [[cell, h3.h3_to_geo(cell)[0], h3.h3_to_geo(cell)[1]] for cell in cells]
                        region_data = pd.DataFrame(data=region_data, columns=reg_cols)
                        hexagones = pd.concat([hexagones, region_data], ignore_index=True)
                i += 1                  
            except:
                # print(region)
                pass

    hexagones = hexagones.set_index('h3').sort_index().drop_duplicates(keep=False)

    return hexagones
        
        
        
        
        