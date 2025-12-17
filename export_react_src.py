import os

# ===== CONFIG =====
SRC_FOLDER = "src"                 # Only export src/
OUTPUT_FILE = "react_src_full.txt" # Output file

INCLUDE_EXTENSIONS = {
    ".js", ".jsx", ".ts", ".tsx",
    ".css", ".scss",
    ".json",
    ".html"
}

# ==================

def collect_files(src_root):
    files = []
    for dirpath, _, filenames in os.walk(src_root):
        for file in filenames:
            ext = os.path.splitext(file)[1].lower()
            if ext in INCLUDE_EXTENSIONS:
                files.append(os.path.join(dirpath, file))
    return files


def write_output(files):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        for filepath in sorted(files):
            out.write("\n" + "=" * 80 + "\n")
            out.write(f"FILE: {filepath}\n")
            out.write("=" * 80 + "\n\n")

            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    out.write(f.read())
            except Exception as e:
                out.write(f"[ERROR READING FILE: {e}]")

    print(f"\n✅ Export completed → '{OUTPUT_FILE}'")


if __name__ == "__main__":
    if not os.path.exists(SRC_FOLDER):
        print("❌ Error: 'src/' folder not found. Run this from your React project root.")
    else:
        print("📦 Exporting src/ folder...")
        files = collect_files(SRC_FOLDER)
        write_output(files)
