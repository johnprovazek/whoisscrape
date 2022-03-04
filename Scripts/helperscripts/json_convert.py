import json
import os
import datetime

data = {}


root_dir = "../../results"
extension_dir_list = os.listdir(root_dir)
for extension_dir in extension_dir_list:
    data[extension_dir] = {}
    domain_name_dir_list = os.listdir(root_dir + "/" + extension_dir)
    for domain_dir_name in domain_name_dir_list:
        data[extension_dir][domain_dir_name] = {"free":[],"taken":[],"error":[]}

        # Error
        error_dir = os.listdir(root_dir + "/" + extension_dir + "/" + domain_dir_name + "/domainerror")
        error_latest_file = None
        error_latest_file_time = datetime.datetime(2000,1,1)
        if len(error_dir) > 0:
            error_latest_file = error_dir[0]
            lt = error_latest_file[5:-4].split('_')
            error_latest_file_time = datetime.datetime(int(lt[0]), int(lt[1]), int(lt[2]), int(lt[3]), int(lt[4]), int(lt[5]))
            for file in error_dir:
                ft = file[5:-4].split('_')
                file_time = datetime.datetime(int(ft[0]), int(ft[1]), int(ft[2]), int(ft[3]), int(ft[4]), int(ft[5]))
                if file_time.time() > error_latest_file_time.time():
                    error_latest_file = file
                    error_latest_file_time = file_time

        # Free
        free_dir = os.listdir(root_dir + "/" + extension_dir + "/" + domain_dir_name + "/domainfree")
        free_latest_file = None
        free_latest_file_time = datetime.datetime(2000,1,1)
        if len(free_dir) > 0:
            free_latest_file = free_dir[0]
            lt = free_latest_file[4:-4].split('_')
            free_latest_file_time = datetime.datetime(int(lt[0]), int(lt[1]), int(lt[2]), int(lt[3]), int(lt[4]), int(lt[5]))
            for file in free_dir:
                ft = file[4:-4].split('_')
                file_time = datetime.datetime(int(ft[0]), int(ft[1]), int(ft[2]), int(ft[3]), int(ft[4]), int(ft[5]))
                if file_time.time() > free_latest_file_time.time():
                    free_latest_file = file
                    free_latest_file_time = file_time

        # Taken
        taken_dir = os.listdir(root_dir + "/" + extension_dir + "/" + domain_dir_name + "/domaintaken")
        taken_latest_file = None
        taken_latest_file_time = datetime.datetime(2000,1,1)
        if len(taken_dir) > 0:
            taken_latest_file = taken_dir[0]
            lt = taken_latest_file[5:-4].split('_')
            taken_latest_file_time = datetime.datetime(int(lt[0]), int(lt[1]), int(lt[2]), int(lt[3]), int(lt[4]), int(lt[5]))
            for file in taken_dir:
                ft = file[5:-4].split('_')
                file_time = datetime.datetime(int(ft[0]), int(ft[1]), int(ft[2]), int(ft[3]), int(ft[4]), int(ft[5]))
                if file_time.time() > taken_latest_file_time.time():
                    taken_latest_file = file
                    taken_latest_file_time = file_time


        data_list= [(error_latest_file_time,error_latest_file,"error"),(free_latest_file_time,free_latest_file,"free"),(taken_latest_file_time,taken_latest_file,"taken")]
        data_list.sort(key=lambda y: y[0])

        print(data_list)


        print("\n\n\n")
        if data_list[2][0] != datetime.datetime(2000,1,1):
            date_striped = data_list[2][0].strftime("%Y_%m_%d_%H_%M_%S")
            date = {"date":date_striped}
            data[extension_dir][domain_dir_name].update(date)
            loop_file = open(root_dir + "/" + extension_dir + "/" + domain_dir_name + "/domain" + data_list[2][2] + "/" + data_list[2][1], "r")
            lines = loop_file.readlines()
            for line in lines:
                data[extension_dir][domain_dir_name][data_list[2][2]].append(line.strip())
        if data_list[1][0] != datetime.datetime(2000,1,1) and data_list[1][0] == data_list[2][0]:
            print("here")
            loop_file = open(root_dir + "/" + extension_dir + "/" + domain_dir_name + "/domain" + data_list[1][2] + "/" + data_list[1][1], "r")
            lines = loop_file.readlines()
            for line in lines:
                data[extension_dir][domain_dir_name][data_list[1][2]].append(line.strip())
        if data_list[0][0] != datetime.datetime(2000,1,1) and data_list[0][0] == data_list[2][0]:
            loop_file = open(root_dir + "/" + extension_dir + "/" + domain_dir_name + "/domain" + data_list[0][2] + "/" + data_list[0][1], "r")
            lines = loop_file.readlines()
            for line in lines:
                data[extension_dir][domain_dir_name][data_list[0][2]].append(line.strip())

with open('../../results.json', 'w') as f:
    json.dump(data, f, indent=4)
