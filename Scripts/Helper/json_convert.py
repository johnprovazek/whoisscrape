import json
import os
import datetime

data = {}

root_dir = "../../Results"
extension_dir_list = os.listdir(root_dir)
for extension_dir in extension_dir_list:
    data[extension_dir] = {}
    domain_name_dir_list = os.listdir(root_dir + "/" + extension_dir)
    for domain_dir_name in domain_name_dir_list:
        data[extension_dir][domain_dir_name] = {"Error":[],"Free":[],"Taken":[]}
        results_categories = ["Error", "Free", "Taken"]
        for category in results_categories:
            outcome_dir = os.listdir(root_dir + "/" + extension_dir + "/" + domain_dir_name + "/Domain" + category)
            if len(outcome_dir) > 0:
                latest_taken_file = outcome_dir[0]
                lt = latest_taken_file[:-4].split('_')
                latest_taken_file_time = datetime.datetime(int(lt[1]), int(lt[2]), int(lt[3]), int(lt[4]), int(lt[5]), int(lt[6]))
                for file in outcome_dir:
                    ft = file[:-4].split('_')
                    file_time = datetime.datetime(int(ft[1]), int(ft[2]), int(ft[3]), int(ft[4]), int(ft[5]), int(ft[6]))
                    if file_time.time() > latest_taken_file_time.time():
                        latest_taken_file = file
                        latest_taken_file_time = file_time
                print(extension_dir + ":" + latest_taken_file)
                loop_file = open(root_dir + "/" + extension_dir + "/" + domain_dir_name + "/Domain" + category + "/" + latest_taken_file, "r")
                Lines = loop_file.readlines()
                count = 0
                for line in Lines:
                    count += 1
                    print("Line{}: {}".format(count, line.strip()))
                    if category == "Taken":
                        split_line = line.split(" ", 1)
                        data[extension_dir][domain_dir_name][category].append({
                            "DomainName": split_line[0],
                            "Date": split_line[1].rstrip(),
                        })
                    else:
                        data[extension_dir][domain_dir_name][category].append(line.strip())

with open('../../results.json', 'w') as f:
    json.dump(data, f, indent=4)
    # print("New json file created")
