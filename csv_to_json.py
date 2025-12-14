#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
karuta.csvをJSONファイルに変換するスクリプト
"""
import csv
import json

# ファイルパス
CSV_FILE = 'data/karuta.csv'
JSON_FILE = 'data/karuta.json'

def convert_csv_to_json():
    """CSVファイルをJSONファイルに変換"""
    data = []
    
    try:
        # CSVファイルを読み込む
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # CSVの列名をJSONのフィールド名に変換
                item = {
                    'id': int(row['id']),
                    'kashira': row['kashira'],
                    'name': row['name'],
                    'furikana': row['furikana'],
                    'saka_no': row['saka_no'],
                    'yomi_kanji': row['yomi_kanji'],
                    'yomi_hiragana': row['yomi_hira'],  # CSVのyomi_hiraをyomi_hiraganaに変換
                    'img_yomi': row['img_yomi'],
                    'img_tori': row['img_tori'],
                    'photo_1': row['photo_1'],
                    'photo_2': row['photo_ 2'],  # CSVのphoto_ 2（スペースあり）をphoto_2に変換
                    'history': row['history'],
                    'lat': float(row['lat']),
                    'lon': float(row['lon'])
                }
                data.append(item)
        
        # JSONファイルに書き込む
        with open(JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f'✓ 変換完了: {len(data)}件のデータを{JSON_FILE}に保存しました。')
        print(f'  最初の項目: ID={data[0]["id"]}, 名前={data[0]["name"]}')
        return True
        
    except FileNotFoundError as e:
        print(f'✗ エラー: ファイルが見つかりません: {e}')
        return False
    except Exception as e:
        print(f'✗ エラー: {e}')
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    import os
    import sys
    
    # 現在のディレクトリを確認
    print(f'現在のディレクトリ: {os.getcwd()}')
    print(f'CSVファイルのパス: {os.path.abspath(CSV_FILE)}')
    print(f'JSONファイルのパス: {os.path.abspath(JSON_FILE)}')
    
    # CSVファイルの存在確認
    if not os.path.exists(CSV_FILE):
        print(f'✗ エラー: CSVファイルが見つかりません: {CSV_FILE}')
        sys.exit(1)
    
    success = convert_csv_to_json()
    if success:
        # JSONファイルの存在確認
        if os.path.exists(JSON_FILE):
            print(f'✓ JSONファイルが正常に作成されました: {os.path.abspath(JSON_FILE)}')
        else:
            print(f'✗ 警告: JSONファイルが作成されませんでした')
    sys.exit(0 if success else 1)
