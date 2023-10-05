from openpyxl import load_workbook


def load_data():

    wb = load_workbook(filename="a.xlsx")
    ws = wb.active
    # print(ws)
    a = ws.values
    a = list(a)
    # print(a[7])
    for i, val in enumerate(a[6:11]):
        val = list(val)
        # print(val)
        print(val[0])
        for j in val[1:]:
            if j:
                print(j.strip('\n').split('\n'))
        print("-----------------------------")


if __name__ == "__main__":
    load_data()
