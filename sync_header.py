import os

def copy_between_lines(f_in, f_out, anchor):
    with open(f_in, encoding="utf8") as infile, open(f_out, 'w', encoding="utf8") as outfile:
        copy = False
        for line in infile:
            hit = (line.strip() == anchor)
            if copy:
                if hit:
                    break
                else:
                    outfile.write(line)
            else:
                if hit:
                    copy = True

def copy_before_lines(f_in, f_out, anchor):
    with open(f_in, encoding="utf8") as infile, open(f_out, 'w', encoding="utf8") as outfile:
        for line in infile:
            outfile.write(line)
            if line.strip() == anchor:
                break

def copy_after_two_lines(f_in, f_out, anchor):
    with open(f_in, encoding="utf8") as infile, open(f_out, 'w', encoding="utf8") as outfile:
        hit_count = 0
        for line in infile:
            if line.strip() == anchor:
                hit_count += 1
            if hit_count >= 2:
                outfile.write(line)

def merge_files(f_1, f_2, f_out):
    data = data2 = ""
    with open(f_1, encoding="utf8") as fp:
        data = fp.read()
    with open(f_2, encoding="utf8") as fp:
        data2 = fp.read()
    data += "\n"
    data += data2
  
    with open (f_out, 'w', encoding="utf8") as fp:
        fp.write(data)

def chunk_copy_file(src_file, dest_file, anchor):
    p_src_file = src_file.replace("/", "_")
    p_dest_file = dest_file.replace("/", "_")

    copy_between_lines(src_file, p_src_file + ".header.trm", anchor)
    copy_before_lines(dest_file, p_dest_file + ".before.header.trm", anchor)
    copy_after_two_lines(dest_file, p_dest_file + ".after.header.trm", anchor)
    merge_files(p_dest_file + ".before.header.trm", p_src_file + ".header.trm", p_src_file + "." + p_dest_file + ".before.header.trm")
    merge_files(p_src_file + "." + p_dest_file + ".before.header.trm", p_dest_file + ".after.header.trm", p_src_file + "." + p_dest_file + ".header.trm")
    os.replace(p_src_file + "." + p_dest_file + ".header.trm", dest_file)
    os.remove(p_src_file + ".header.trm")
    os.remove(p_dest_file + ".before.header.trm")
    os.remove(p_dest_file + ".after.header.trm")
    os.remove(p_src_file + "." + p_dest_file + ".before.header.trm")

chunk_copy_file("index.html", "pages/page.html", "<!--##Anchor-1##-->")
chunk_copy_file("main.css", "pages/page.css", "<!--##Anchor-1##-->")