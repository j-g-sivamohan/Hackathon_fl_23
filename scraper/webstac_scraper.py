from bs4 import BeautifulSoup
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import StaleElementReferenceException
from selenium.common.exceptions import NoSuchElementException
import time



#start active

options = Options()
options.add_experimental_option("detach", True)

def run_dept(i, school):
    print("i is " + str(school))

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    def extract_info(dept, id_ref=None):
        # driver.get("https://courses.wustl.edu/Semester/Listing.aspx")
        test_id = ""
        dept_name = ""
        links = driver.find_elements("xpath", "//a[@href]")
        AS_links.clear()
        # sem_links.clear()
        for link in links:
            # if "Body_hlSemester4" in link.get_attribute("id"):
            #     sem_links.append(link)
            if "Body_dlDepartments" in link.get_attribute("id"):
                AS_links.append(link)
        # sem_links[0].click()
        AS_links[dept].click()
        dept_name = AS_links[dept].text
        print("dept is " , dept)
        t_lists = []
        if(id_ref != None): 
            while(True):
                print("checking in loop again")
                try:
                    # poll the link with an arbitrary call
                    driver.find_element(By.ID, id_ref)
                except NoSuchElementException or StaleElementReferenceException:
                    soup = BeautifulSoup(driver.page_source, 'html.parser')
                    lists = soup.find_all('table', class_="MainTableRow SecOpen")
                    t_lists = soup.find_all('div', class_="CrsOpen")
                    break
        else:#on the first iteration you just check if maintablerow is empty or not
            while(True):
                print("checking in loop")
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                #t_lists is a list of all of the possible classes taught in the department
                t_lists = soup.find_all('div', class_="CrsOpen")
                lists = soup.find_all('table', class_="MainTableRow SecOpen")
                print("list length " + str(len(lists)))
                if(len(lists)!=0):
                    break
                t_lists = soup.find_all('div', class_="CrsOpen")
                lists = soup.find_all('table', class_="MainTableRow SecClosed")
                if(len(lists)!=0):
                    break
        print("t_list: " + str(len(t_lists)))
        info_list = []
        new_name = dept_name.replace(",", "")
        for clas in t_lists:
                c_name = (clas.find_all('a', attrs={"style": "font-weight: bold; text-align:left;"})[1].text.strip().replace(",",""))
                for c in (clas.find_all('table', class_="MainTableRow SecOpen")):
                    base_info = c.find_all('td', class_="ItemRow")
                    seat_info = c.find_all('td', class_="ItemRowCenter")
                    info_list.append((base_info[1].text.strip(), base_info[2].text.strip(), base_info[3].text.strip(), seat_info[0].text.strip(),seat_info[1].text.strip(), seat_info[2].text.strip(), new_name.strip(),c_name, base_info[4].text.strip().replace(",","")))
                for c in (clas.find_all('table', class_="MainTableRow SecClosed")):
                    base_info = c.find_all('td', class_="ItemRow")
                    seat_info = c.find_all('td', class_="ItemRowCenter")
                    info_list.append((base_info[1].text.strip(), base_info[2].text.strip(), base_info[3].text.strip(),seat_info[0].text.strip(),seat_info[1].text.strip(), seat_info[2].text.strip(), new_name.strip(),c_name, base_info[4].text.strip().replace(",","")))
        # soup = BeautifulSoup(driver.page_source, 'html_parser')
        # lists = soup.find_all('table', class_="MainTableRow SecOpen")
        if(len(lists)==0):
            return None
        id_ref = lists[0].get("id")
        print("test_id: " , id_ref)
        print("open list : " + str(len(lists)))

        # for list in lists:
        #     base_info = list.find_all('td', class_="ItemRow")
        #     seat_info = list.find_all('td', class_="ItemRowCenter")
        #     info_list.append((base_info[1].text.strip(), base_info[2].text.strip(), base_info[3].text.strip(), base_info[4].text.strip().replace(",",""),seat_info[0].text.strip(),seat_info[1].text.strip(), seat_info[2].text.strip(), new_name.strip()))
        # lists = soup.find_all('table', class_="MainTableRow SecClosed")
        # print("closed list : " + str(len(lists)))
        # for list in lists:
        #     base_info = list.find_all('td', class_="ItemRow")
        #     seat_info = list.find_all('td', class_="ItemRowCenter")
        #     info_list.append((base_info[1].text.strip(), base_info[2].text.strip(), base_info[3].text.strip(), base_info[4].text.strip().replace(",",""),seat_info[0].text.strip(), seat_info[1].text.strip(), seat_info[2].text.strip(), new_name.strip()))
        f = open("fl23_test_file.txt", "a")
        # f.write("more testing")
        for c in info_list:
            for info in c:
                # print(info)
                f.write(str(info) + ", ")
                f.flush()
            f.write("\n")
        f.close()
        return (info_list, id_ref)


    AS_links = []

    main_info_list = []#list of all of the departments in art_sci and their information

    test_id  = ""#string of id on page for table used to check if we're now on a new table

    sem_links= []

    driver.get("https://courses.wustl.edu/Semester/Listing.aspx")
    links = driver.find_elements("xpath", "//a[@href]")
    for link in links:
        if "Body_hlSemester2" in link.get_attribute("id"):
            sem_links.append(link)
    sem_links[0].click()

    test_compare = "font-weight: bold;"
    test_case_string = ""
    check_list = []
    time.sleep(2)
    while(True):
        try:
            # elems = driver.find_elements("xpath", "//a[(@id = 'Body_hlSemester4') and (@style = 'font-weight: normal;')]")
            # elems = driver.find_elements(By.ID, 'Body_hlSemester4')
            # print("length init: " ,len(elems))
            # print(elems[0].get_attribute("style"))
            # for e in elems:
            if "bold" in driver.find_elements(By.ID, 'Body_hlSemester2')[0].get_attribute("style"):
                break
            # print(driver.find_element(By.ID, 'Body_hlSemester4').get_attribute("style"))
            # print(len(elems))
            # if(len(elems)==0):
            #     break
        except StaleElementReferenceException:
            break
    print(driver.find_element(By.ID, 'Body_hlSemester2').get_attribute("style"))
    num_dept = 0
    school_links = []

    links = driver.find_elements("xpath", "//a[@href]")
    for link in links:
        if "Body_repSchools" in link.get_attribute("id"):
            school_links.append(link)

    school_links[school].click()
    time.sleep(2)
    while(True):
        try:
            if "bold" in driver.find_elements(By.ID, 'Body_repSchools_lnkSchool_' + str(school))[0].get_attribute("style"):
                break
        except StaleElementReferenceException:
            break

    links = driver.find_elements("xpath", "//a[@href]")
    for link in links:
        if "Body_dlDepartments" in link.get_attribute("id"):
            num_dept = num_dept +1



# extract_info(68,None)
#keep for normal use
    test_id = None
    # for i in (2):
    # print("i is: " ,i)
    ret_tuple = extract_info(i, test_id)
    if ret_tuple is not None:
        print("new_id")
        test_id = ret_tuple[1]
    # main_info_list.append(ret_tuple[0])
#161
#end active

c_prog = ((4,[0]), (4,[0,1]), (68,[46,60]), (19,[0,6]), (-1,[0]) ,(4,[0,1,2,3]), (8,[0]), (10,[0,5,6,9]), (7,[0]), (7,[0,5,6]), (30,[0,1,2,4,5,7,8,9,10,13,14,16,17,18,19,20,22,23,24,25,26,27,29]), (16,[0,13]))

for j in range((c_prog[11][0])):
    # print(c_prog[i][1])
    if j in c_prog[11][1]:
        continue
    else:
        run_dept(j,11)


# for i in range(10,len(c_prog)):    
#     if c_prog[i][0]==-1:
#         continue
#     print(c_prog[i][0])
#     print(c_prog[i][1])
#     for j in range((c_prog[i][0])):
#         # print(c_prog[i][1])
#         if j in c_prog[i][1]:
#             continue
#         else:
#             run_dept(j,i)
    
# for d in (5,7):
#     run_dept(d,3)


# for dept in main_info_list:
#     # print("size: " + str(len(dept)))
#     print(dept)
#     print()



# for i in range(1,len(AS_links)):
#     AS_links[i].click()
#     done = False
#     while(not done):
#         try:
#             # poll the link with an arbitrary call
#             driver.find_elements(By.ID, test_id)
#             break
#         except StaleElementReferenceException:
#             done = False
#     lists = soup.find_all('table', class_="MainTableRow SecOpen")
#     test_id = lists[0].get("id")
#     for list in lists:
#         base_info = list.find_all('td', class_="ItemRow")
#         seat_info = list.find_all('td', class_="ItemRowCenter")
#         info_list.append((base_info[1].text, base_info[2].text, base_info[3].text, seat_info[0].text))
#     lists = soup.find_all('table', class_="MainTableRow SecClosed")
#     for list in lists:
#         base_info = list.find_all('td', class_="ItemRow")
#         seat_info = list.find_all('td', class_="ItemRowCenter")
#         info_list.append((base_info[1].text, base_info[2].text, base_info[3].text, seat_info[1].text))

#     main_info_list.append(info_list)
#     info_list.clear()
#     AS_links.clear()
#     links = driver.find_elements("xpath", "//a[@href]")
#     for link in links:
#         if "Body_dlDepartments" in link.get_attribute("id"):
#             AS_links.append(link)
    
# f = open("new_test_file.txt", "a")
# # f.write("more testing")
# for dept in main_info_list:
#     for c in dept:
#         for info in c:
#             print(info)
#             f.write(str(info) + ", ")
#             f.flush()
#         f.write("\n")
# # f.write(main_info_list)
# f.close()
# print("done with write")

#53 and 68

# f = open("new_file.txt", "a")
# f.write("hello world again")
# f.close()





# print(main_info_list)

# print("broken out")

# time.sleep(5)

# time.sleep(5)

# MainTableRow

# Body_Body_cboSemester

# print(driver.page_source)




# url = "https://courses.wustl.edu/Semester/Listing.aspx"

# page = requests.get(url)

# soup = BeautifulSoup(page.content, 'html.parser')

# print(soup)

# lists = soup.find_all('table', class_="MainTableRow SecClosed")

# print(lists)