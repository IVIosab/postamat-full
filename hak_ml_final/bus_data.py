# this script reads the bus data made available by Moscow government site, cleans it 
# and extracts valuable information for our purposes

import pandas as pd
import re
import h3
import os

# the default locations for the bus tables
bus_routes_default  = os.path.join("used_data", "bus_data", "bus_routes.xlsx")
bus_routes_frequency_default = os.path.join("used_data", "bus_data", "bus_routes_frequency.xlsx")


def _clean_routes(row):
    # remove any characters that do not belong to [digits,;.]
    row['route'] = re.sub(r'[^0-9,;.]+', "", row['route'])
    return row


def _extract_bus_routes(data_loc):
    routes = pd.read_excel(data_loc)
    # extract and rename the needed columns           
    routes = routes.loc[:, ['RouteNumber', 'DirectRouteTrack']]
    routes = routes.rename(columns={"DirectRouteTrack": "route", "RouteNumber": "route_id"})
    # clean the routes' representations in each row
    routes = routes.apply(_clean_routes, axis=1)
    
    return routes


def _extract_routes_count(data_loc:str):
    routes_freq = pd.read_excel(data_loc)
    # filter the useful columns
    routes_freq = routes_freq.loc[:, ['route_id', 'trip_id']]
    # convert the routes frequency's dataframe into a count dataframe
    # the latter associates the route with the number of bus trips passing by that route
    routes_count = pd.pivot_table(routes_freq, index='route_id', values='trip_id', aggfunc=['count']).sort_index()
    # rename the columns for easier manipulation
    routes_count.columns= ['trip_count']

    return routes_count
    
def get_bus_data(bus_routes_loc:str=None, routes_frequency_loc:str=None):
    if bus_routes_loc is None:
        bus_routes_loc = bus_routes_default 
    
    if routes_frequency_loc is None:
        routes_frequency_loc = bus_routes_frequency_default
    
    # extract the routes: their ids + the coordinates of its different stops
    routes = _extract_bus_routes(bus_routes_loc)
    # extract the number of trips passing by each route
    routes_count= _extract_routes_count(routes_frequency_loc)
    # merge the two dataframes into a single table
    df_traffic = pd.merge(routes, routes_count, how='inner', right_index=True, left_index=True)
    # return the table keeping only the route's coordinates and the trip count
    return df_traffic.drop(columns=['route_id'])

    
def _add_one_route(initial_df: pd.DataFrame, resolution:int, route_coordinates_string: str, route_count: int):
    # first of all: make sure the passed dataframe uses the column 'h3' as its index
    initial_df.reset_index(inplace=True)
    # in case the index was previously a generic non column-specific index
    try:
        initial_df.drop(columns=['index'], inplace=True)
    except:
        pass
    
    # there should be a 'h3' column otherwise an error will be raised
    try:
        initial_df.set_index('h3', inplace=True)
    except KeyError:
        raise ValueError("Please make sure that the passed dataframe has a column names 'h3'")
    
    # first of all split the route_coordinates string into tuples of coordinates 
    stops = re.split(";", route_coordinates_string)
    # iterate through each station     
    for s in stops:
        if len(s) == 0: continue
        # extract the latitute and longitude 
        lng, lat = re.split(":", s)
        lat, lng = float(lat), float(lng)
        # extract the h3-index of the hexagone for which the given stop belongs to 
        # with the passed resolution
        h3_addr = h3.geo_to_h3(lat=lat, lng=lng, resolution=resolution)
        try:
            # if a stop s belongs to a certain hexagone in the given data, then increment the bus_trip_count 
            # of that hexagone by the number of trips passing by that stop
            initial_df.loc[h3_addr, 'bus_trip_count'] += route_count
        except KeyError:
            # this means the current stop does not belong to any of the hexagones 
            # in the initial dataset
            pass
    
    
def add_bus_data(initial_df: pd.DataFrame, resolution: int, bus_data: pd.DataFrame=None):
    """This function, given a dataframe with data of h3 hexagones with the passed resolution,
    adds the bus-related data accordingly: how many bus trips pass by a certain hexagone (region)

    Args:
        initial_df (pd.DataFrame): the dataframe with the hexagones' data
        resolution (int): the resolution of the hexagones in the 'initial_df'
        bus_data (pd.DataFrame, optional): the buses's data: either passed explicitly or extracted from the local files

    Returns:
        pd.DataFrame: the old dataframe equipped with the buses data
    """ 
    
    if bus_data is None:
        bus_data = get_bus_data()

    # add the 'bus_trip_count' column to the passed dataframe
    # and set all its row to 0
    initial_df['bus_trip_count'] = 0 
    # iterate through the route and the trip count of each row in the bus_data dataframe
    for route, trip_count in zip(bus_data['route'], bus_data['trip_count']):
        _add_one_route(initial_df, resolution, route, trip_count)
    
    return initial_df
    

